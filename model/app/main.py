import io
import os
import numpy as np
import torch
import torch.nn as nn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from scipy.ndimage import convolve
from scipy.fft import dctn

app = FastAPI(title="Stego Analysis Model API v5")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# ── CONFIGURACIONES GLOBALES ──────────────────────────────────────────────────
CROP_SIZE = 256
N_CLASSES = 5
NOMBRES_CLASES = ['Cover', 'LSB', 'DCT', 'PVD', 'BPCS']
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ── EXTRACCIÓN DE CARACTERÍSTICAS (SRM y DCT) ──────────────────────────────────
KERNELS_SRM = [
  np.array([[ 0,  1,  0], [ 1, -4,  1], [ 0,  1,  0]], dtype=np.float32) / 4.0,
  np.array([[ 1,  1,  1], [ 1, -8,  1], [ 1,  1,  1]], dtype=np.float32) / 8.0,
  np.array([[ 0,  0,  0], [ 1, -2,  1], [ 0,  0,  0]], dtype=np.float32) / 2.0,
  np.array([[ 0,  1,  0], [ 0, -2,  0], [ 0,  1,  0]], dtype=np.float32) / 2.0,
  np.array([[ 1,  0,  1], [ 0, -4,  0], [ 1,  0,  1]], dtype=np.float32) / 4.0,
]

def calcular_residuos_srm(img_array: np.ndarray, T: float = 4.0) -> np.ndarray:
  img = img_array.astype(np.float32)
  canales = []
  for c in range(3):
    for k in KERNELS_SRM:
      r = convolve(img[:, :, c], k, mode='reflect')
      canales.append(np.clip(r, -T, T) / T)
  return np.stack(canales, axis=-1)

def dct_features(img_array: np.ndarray, block_size: int = 8) -> np.ndarray:
  H, W = img_array.shape[:2]
  img_f = img_array.astype(np.float32)
  Y = 0.299 * img_f[:, :, 0] + 0.587 * img_f[:, :, 1] + 0.114 * img_f[:, :, 2] - 128.0
  dct_map = np.zeros((H, W), dtype=np.float32)
  for i in range(0, H - block_size + 1, block_size):
    for j in range(0, W - block_size + 1, block_size):
      bloque = Y[i:i + block_size, j:j + block_size]
      D = dctn(bloque, norm='ortho')
      dct_map[i:i + block_size, j:j + block_size] = np.log1p(np.abs(D))
  mx = dct_map.max()
  if mx > 0: dct_map /= mx
  return dct_map[:, :, np.newaxis]

# ── ARQUITECTURA DEL MODELO STEGOCNNV5 ─────────────────────────────────────────
class ConvBNMish(nn.Module):
  def __init__(self, in_c, out_c, kernel=3, stride=1):
    super().__init__()
    self.block = nn.Sequential(
      nn.Conv2d(in_c, out_c, kernel, stride=stride, padding=kernel//2, bias=False),
      nn.BatchNorm2d(out_c),
      nn.Mish()
    )
  def forward(self, x): return self.block(x)

class ResidualBlock(nn.Module):
  def __init__(self, in_c, out_c, stride=1):
    super().__init__()
    self.downsample = (stride != 1 or in_c != out_c)
    if self.downsample:
      self.shortcut = nn.Sequential(nn.Conv2d(in_c, out_c, 1, stride=stride, bias=False), nn.BatchNorm2d(out_c))
    self.conv1 = ConvBNMish(in_c, out_c, 3, stride=stride)
    self.conv2 = nn.Sequential(nn.Conv2d(out_c, out_c, 3, padding=1, bias=False), nn.BatchNorm2d(out_c))
    self.act = nn.Mish()
  def forward(self, x):
    shortcut = self.shortcut(x) if self.downsample else x
    return self.act(self.conv2(self.conv1(x)) + shortcut)

class SeparableConv2d(nn.Module):
  def __init__(self, in_c, out_c):
    super().__init__()
    self.depthwise = nn.Conv2d(in_c, in_c, 3, padding=1, groups=in_c, bias=False)
    self.pointwise = nn.Conv2d(in_c, out_c, 1, bias=False)
    self.bn = nn.BatchNorm2d(out_c)
    self.act = nn.Mish()
  def forward(self, x): return self.act(self.bn(self.pointwise(self.depthwise(x))))

class SqueezeExcitation(nn.Module):
  def __init__(self, channels, ratio=8):
    super().__init__()
    self.fc = nn.Sequential(
      nn.Linear(channels, max(channels // ratio, 4)), nn.ReLU(inplace=True),
      nn.Linear(max(channels // ratio, 4), channels), nn.Sigmoid()
    )
  def forward(self, x):
    b, c, _, _ = x.size()
    scale = self.fc(x.view(b, c, -1).mean(dim=2)).view(b, c, 1, 1)
    return x * scale

class StegoCNNv5(nn.Module):
  def __init__(self):
    super().__init__()
    self.srm_stem = ConvBNMish(15, 32)
    self.srm_layers = nn.Sequential(
      ResidualBlock(32, 32), nn.AvgPool2d(2), ResidualBlock(32, 64), nn.AvgPool2d(2),
      ResidualBlock(64, 96), nn.AvgPool2d(2), ResidualBlock(96, 128), nn.AvgPool2d(2), ResidualBlock(128, 128)
    )
    self.dct_stem = nn.Sequential(nn.Conv2d(1, 16, 3, padding=1, bias=False), nn.BatchNorm2d(16), nn.Mish())
    self.dct_layers = nn.Sequential(
      SeparableConv2d(16, 32), nn.AvgPool2d(2), SeparableConv2d(32, 64), nn.AvgPool2d(2),
      SeparableConv2d(64, 96), nn.AvgPool2d(2), SeparableConv2d(96, 128), nn.AvgPool2d(2), SeparableConv2d(128, 128)
    )
    self.se = SqueezeExcitation(256, ratio=8)
    self.head = nn.Sequential(
      nn.Linear(256, 128), nn.BatchNorm1d(128), nn.Mish(), nn.Dropout(0.45),
      nn.Linear(128, 64),  nn.BatchNorm1d(64),  nn.Mish(), nn.Dropout(0.45),
      nn.Linear(64, N_CLASSES)
    )

  def forward(self, srm, dct):
    f_srm = self.srm_layers(self.srm_stem(srm)).mean(dim=[2, 3])
    f_dct = self.dct_layers(self.dct_stem(dct)).mean(dim=[2, 3])
    fused = torch.cat([f_srm, f_dct], dim=1)
    fused_scaled = self.se(fused.view(fused.size(0), fused.size(1), 1, 1)).view(fused.size(0), -1)
    return self.head(fused_scaled)

# ── CARGA DEL MODELO ──────────────────────────────────────────────────────────
model = None
try:
  model_path = "stego_cnn_v5_best.pt"
  if os.path.exists(model_path):
    model = StegoCNNv5().to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    print(f"✅ Pesos cargados exitosamente en: {device}")
  else:
    print(f"⚠️ Archivo '{model_path}' no encontrado. Iniciando en modo Demo.")
except Exception as e:
  print(f"❌ Error crítico al inicializar el modelo: {e}")
  model = None

# ── ENDPOINTS ─────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
  return {"message": "API StegoCNNv5 funcionando"}

@app.get("/api/health")
def health():
  return {"status": "ok", "device": str(device), "model_loaded": model is not None}

@app.post("/model")
async def predict(id: str = Form(...), file: UploadFile = File(...)):
  if model is None:
    return {
      "status": "demo",
      "id_recibido": id,
      "archivo_nombre": file.filename,
      "prediccion": "Modelo no cargado en el servidor (Modo Demo)"
    }
      
  try:
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    arr = np.array(image, dtype=np.uint8)
    H, W, _ = arr.shape

    # Manejo de padding si la imagen es más chica que el CROP_SIZE
    if H < CROP_SIZE or W < CROP_SIZE:
      pad_h = max(0, CROP_SIZE - H)
      pad_w = max(0, CROP_SIZE - W)
      arr = np.pad(arr, ((pad_h//2, pad_h - pad_h//2), (pad_w//2, pad_w - pad_w//2), (0,0)), mode='reflect')
      H, W, _ = arr.shape

    # Center Crop exacto como en la fase de validación/test
    y0, x0 = (H - CROP_SIZE) // 2, (W - CROP_SIZE) // 2
    parche = arr[y0:y0 + CROP_SIZE, x0:x0 + CROP_SIZE, :]
    
    # Procesamiento SRM y DCT
    srm_np = np.transpose(calcular_residuos_srm(parche), (2, 0, 1)).astype(np.float32)
    dct_np = np.transpose(dct_features(parche), (2, 0, 1)).astype(np.float32)
    
    # Agregar dimensión de Batch y pasar a Tensors
    srm_tensor = torch.tensor(srm_np).unsqueeze(0).to(device)
    dct_tensor = torch.tensor(dct_np).unsqueeze(0).to(device)

    # Inferencia
    with torch.no_grad():
      outputs = model(srm_tensor, dct_tensor)
      probabilities = torch.softmax(outputs, dim=1).cpu().numpy()[0]
      predicted_idx = int(np.argmax(probabilities))
      clase_predicha = NOMBRES_CLASES[predicted_idx]

    # Estructurar la salida para que tengas todo listo para armar tu frontend/response final
    return {
      "status": "success",
      "id_recibido": id,
      "archivo_nombre": file.filename,
      "prediccion": {
        "clase": clase_predicha,
        "score_confianza": float(probabilities[predicted_idx]),
        "confianzas_detalladas": {
          NOMBRES_CLASES[i]: float(probabilities[i]) for i in range(len(NOMBRES_CLASES))
        }
      }
    }

  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error procesando la imagen: {str(e)}")