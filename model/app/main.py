from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torchvision.transforms as transforms
from PIL import Image
import io

app = FastAPI(title="Assessment67 Model API")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

try:
  device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
  # model = torch.load("tu_modelo.pth", map_location=device)
  # model.eval()
  print(f"Modelo cargado exitosamente en: {device}")
except Exception as e:
  print(f"Error al cargar el modelo: {e}")
  model = None 

# Transformaciones estándar para la imagen (ajusta según cómo entrenaste tu modelo)
preprocess = transforms.Compose([
  transforms.Resize((224, 224)),
  transforms.ToTensor(),
  transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# ENDPOINTS

@app.get("/")
async def root():
  return {"message": "API funcionando"}

@app.get("/api/health")
def health():
  return {"status": "ok"}

@app.post("/model")
async def predict(id, file):
  try:
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    input_tensor = preprocess(image)
    input_batch = input_tensor.unsqueeze(0)

    if model is not None:
      with torch.no_grad():
        input_batch = input_batch.to(device)
        output = model(input_batch)
        
        resultado_final = f"Shape de salida: {list(output.shape)}"
    else:
      resultado_final = "Modelo no cargado en el servidor (Modo Demo)"

    return {
      "status": "success",
      "id_recibido": id,
      "archivo_nombre": file.filename,
      "prediccion": resultado_final
    }

  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error procesando la imagen: {str(e)}")