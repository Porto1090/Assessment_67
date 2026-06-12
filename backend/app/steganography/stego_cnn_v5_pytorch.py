import os, math, random, time
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image
from scipy.ndimage import convolve
from scipy.fft import dctn
from tqdm import tqdm

# Forzar a matplotlib a no buscar una ventana gráfica (Esencial para SSH/Nohup)
import matplotlib
matplotlib.use('Agg')

from sklearn.metrics import classification_report, confusion_matrix, f1_score
from sklearn.utils.class_weight import compute_class_weight

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

# ── Configuración de Dispositivo y Semilla ───────────────────────────────────
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(SEED)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ── Constantes ───────────────────────────────────────────────────────────────
CROP_SIZE   = 256
N_CLASSES   = 5
BATCH_SIZE  = 64           
EPOCHS      = 20
LR_INIT     = 3e-3
WEIGHT_DECAY = 1e-4
DROPOUT     = 0.45

BASE_DIR = Path.home() / "Desktop" / "images"
CLASES_DIR = ['original', 'lsb', 'dct', 'pvd', 'bpcs']
NOMBRES_CLASES = ['Cover', 'LSB', 'DCT', 'PVD', 'BPCS']

# ── Sistema de Diagnóstico de Hardware Inicial ──────────────────────────────
print("=" * 60)
print(" 🛠️  SISTEMA DE DIAGNÓSTICO INTEGRADO (PyTorch)")
print("=" * 60)
print(f"Fecha/Hora de Inicio : {time.strftime('%Y-%m-%d %H:%M:%S')}")
print(f"Dispositivo Activo   : {device}")

if torch.cuda.is_available():
    print(f"GPU Detectada        : {torch.cuda.get_device_name(0)}")
    vram_total = torch.cuda.get_device_properties(0).total_memory / (1024**3)
    print(f"VRAM Total Disponible: {vram_total:.2f} GB")
    # Inicialización de contexto CUDA para asegurar estabilidad
    torch.cuda.get_device_properties(0)
else:
    print("⚠️ ¡ALERTA!: Ejecutando en CPU. El rendimiento será severamente afectado.")

# Intentar detectar hilos de CPU disponibles
cpus_disponibles = os.cpu_count() or 1
print(f"Hilos lógicos de CPU : {cpus_disponibles}")
print(f"Configuración Batch  : {BATCH_SIZE} imágenes por paso")
print("=" * 60)

# ── Kernels SRM ──────────────────────────────────────────────────────────────
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
    return np.stack(canales, axis=-1)  # (H, W, 15)

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
    if mx > 0:
        dct_map /= mx
    return dct_map[:, :, np.newaxis] # (H, W, 1)

# ── Dataset de PyTorch ────────────────────────────────────────────────────────
class StegoDataset(Dataset):
    def __init__(self, rutas, labels, training=True):
        self.rutas = rutas
        self.labels = labels
        self.training = training
        self.rng = np.random.default_rng(SEED)

    def __len__(self):
        return len(self.rutas)

    def __getitem__(self, idx):
        ruta = Path(self.rutas[idx])
        label = self.labels[idx]
        
        img = Image.open(ruta).convert('RGB')
        arr = np.array(img, dtype=np.uint8)
        H, W, _ = arr.shape

        if H < CROP_SIZE or W < CROP_SIZE:
            pad_h = max(0, CROP_SIZE - H)
            pad_w = max(0, CROP_SIZE - W)
            arr = np.pad(arr, ((pad_h//2, pad_h - pad_h//2), (pad_w//2, pad_w - pad_w//2), (0,0)), mode='reflect')
            H, W, _ = arr.shape

        if self.training:
            y0 = self.rng.integers(0, H - CROP_SIZE + 1)
            x0 = self.rng.integers(0, W - CROP_SIZE + 1)
        else:
            y0, x0 = (H - CROP_SIZE) // 2, (W - CROP_SIZE) // 2

        parche = arr[y0:y0 + CROP_SIZE, x0:x0 + CROP_SIZE, :]
        
        srm = calcular_residuos_srm(parche)
        dct = dct_features(parche)
        
        srm = np.transpose(srm, (2, 0, 1)).astype(np.float32)
        dct = np.transpose(dct, (2, 0, 1)).astype(np.float32)
        
        return torch.tensor(srm), torch.tensor(dct), torch.tensor(label, dtype=torch.long)

def cargar_rutas_de_fase(fase: str):
    rutas, labels = [], []
    for idx, carpeta in enumerate(CLASES_DIR):
        dir_path = BASE_DIR / fase / carpeta
        if not dir_path.exists(): continue
        for ext in ['*.png', '*.tif', '*.bmp']:
            for r in dir_path.glob(ext):
                rutas.append(str(r))
                labels.append(idx)
    return rutas, np.array(labels, dtype=np.int32)

print("\nCargando mapeo de datos y validando balance de clases...")
r_train, y_train = cargar_rutas_de_fase('train')
r_val, y_val     = cargar_rutas_de_fase('val')
r_test, y_test   = cargar_rutas_de_fase('test')

print(f" -> Dataset Train: {len(r_train)} imágenes")
print(f" -> Dataset Val  : {len(r_val)} imágenes")
print(f" -> Dataset Test : {len(r_test)} imágenes")

train_ds = StegoDataset(r_train, y_train, training=True)
val_ds   = StegoDataset(r_val, y_val, training=False)
test_ds  = StegoDataset(r_test, y_test, training=False)

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True, num_workers=8, pin_memory=True)
val_loader   = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False, num_workers=8, pin_memory=True)
test_loader  = DataLoader(test_ds, batch_size=BATCH_SIZE, shuffle=False, num_workers=8, pin_memory=True)

pesos = compute_class_weight('balanced', classes=np.arange(N_CLASSES), y=y_train)
class_weights = torch.tensor(pesos, dtype=torch.float32).to(device)

# ── Arquitectura del Modelo ──────────────────────────────────────────────────
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
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_c, out_c, 1, stride=stride, bias=False),
                nn.BatchNorm2d(out_c)
            )
        self.conv1 = ConvBNMish(in_c, out_c, 3, stride=stride)
        self.conv2 = nn.Sequential(
            nn.Conv2d(out_c, out_c, 3, padding=1, bias=False),
            nn.BatchNorm2d(out_c)
        )
        self.act = nn.Mish()
    def forward(self, x):
        shortcut = self.shortcut(x) if self.downsample else x
        out = self.conv1(x)
        out = self.conv2(out)
        return self.act(out + shortcut)

class SeparableConv2d(nn.Module):
    def __init__(self, in_c, out_c):
        super().__init__()
        self.depthwise = nn.Conv2d(in_c, in_c, 3, padding=1, groups=in_c, bias=False)
        self.pointwise = nn.Conv2d(in_c, out_c, 1, bias=False)
        self.bn = nn.BatchNorm2d(out_c)
        self.act = nn.Mish()
    def forward(self, x):
        return self.act(self.bn(self.pointwise(self.depthwise(x))))

class SqueezeExcitation(nn.Module):
    def __init__(self, channels, ratio=8):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(channels, max(channels // ratio, 4)),
            nn.ReLU(inplace=True),
            nn.Linear(max(channels // ratio, 4), channels),
            nn.Sigmoid()
        )
    def forward(self, x):
        b, c, _, _ = x.size()
        flat = x.view(b, c, -1).mean(dim=2)
        scale = self.fc(flat).view(b, c, 1, 1)
        return x * scale

class StegoCNNv5(nn.Module):
    def __init__(self):
        super().__init__()
        self.srm_stem = ConvBNMish(15, 32)
        self.srm_layers = nn.Sequential(
            ResidualBlock(32, 32),   nn.AvgPool2d(2),
            ResidualBlock(32, 64),   nn.AvgPool2d(2),
            ResidualBlock(64, 96),   nn.AvgPool2d(2),
            ResidualBlock(96, 128),  nn.AvgPool2d(2),
            ResidualBlock(128, 128)
        )
        
        self.dct_stem = nn.Sequential(nn.Conv2d(1, 16, 3, padding=1, bias=False), nn.BatchNorm2d(16), nn.Mish())
        self.dct_layers = nn.Sequential(
            SeparableConv2d(16, 32),  nn.AvgPool2d(2),
            SeparableConv2d(32, 64),  nn.AvgPool2d(2),
            SeparableConv2d(64, 96),  nn.AvgPool2d(2),
            SeparableConv2d(96, 128), nn.AvgPool2d(2),
            SeparableConv2d(128, 128)
        )
        
        self.se = SqueezeExcitation(256, ratio=8)
        
        self.head = nn.Sequential(
            nn.Linear(256, 128), nn.BatchNorm1d(128), nn.Mish(), nn.Dropout(DROPOUT),
            nn.Linear(128, 64),  nn.BatchNorm1d(64),  nn.Mish(), nn.Dropout(DROPOUT),
            nn.Linear(64, N_CLASSES)
        )

    def forward(self, srm, dct):
        f_srm = self.srm_layers(self.srm_stem(srm)).mean(dim=[2, 3])
        f_dct = self.dct_layers(self.dct_stem(dct)).mean(dim=[2, 3])
        fused = torch.cat([f_srm, f_dct], dim=1)
        
        fused_tensor = fused.view(fused.size(0), fused.size(1), 1, 1)
        fused_scaled = self.se(fused_tensor).view(fused.size(0), -1)
        
        return self.head(fused_scaled)

modelo = StegoCNNv5().to(device)

criterion = nn.CrossEntropyLoss(weight=class_weights)
optimizer = optim.AdamW(modelo.parameters(), lr=LR_INIT, weight_decay=WEIGHT_DECAY)
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=EPOCHS, eta_min=LR_INIT*1e-2)

# ── Loop de Entrenamiento con Historial Estructurado ──────────────────────────
best_f1 = 0.0
csv_log_path = 'stego_cnn_v5_log.csv'

# Estructura de almacenamiento de métricas para las gráficas
history = {
    'epoch': [], 'train_loss': [], 'train_acc': [], 
    'val_loss': [], 'val_acc': [], 'val_f1': []
}

print("\n🚀 Comenzando entrenamiento de alta velocidad en GPU con PyTorch...")
for epoch in range(EPOCHS):
    modelo.train()
    running_loss, correct, total = 0.0, 0, 0
    
    pbar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS}")
    for srm, dct, labels in pbar:
        srm, dct, labels = srm.to(device), dct.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = modelo(srm, dct)
        loss = criterion(outputs, labels)
        
        # Regularización L2
        l2_reg = sum(p.pow(2.0).sum() for p in modelo.parameters())
        loss += 1e-4 * l2_reg
        
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item() * srm.size(0)
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()
        pbar.set_postfix(loss=loss.item(), acc=correct/total)
        
    scheduler.step()
    
    # Métricas finales de entrenamiento de la época
    epoch_train_loss = running_loss / total
    epoch_train_acc = correct / total
    
    # Fase de Validación
    modelo.eval()
    val_loss, val_correct, val_total = 0.0, 0, 0
    all_preds, all_trues = [], []
    
    with torch.no_grad():
        for srm, dct, labels in val_loader:
            srm, dct, labels = srm.to(device), dct.to(device), labels.to(device)
            outputs = modelo(srm, dct)
            loss = criterion(outputs, labels)
            val_loss += loss.item() * srm.size(0)
            _, predicted = outputs.max(1)
            val_total += labels.size(0)
            val_correct += predicted.eq(labels).sum().item()
            all_preds.extend(predicted.cpu().numpy())
            all_trues.extend(labels.cpu().numpy())
            
    epoch_val_loss = val_loss / val_total
    epoch_val_acc = val_correct / val_total
    epoch_f1 = f1_score(all_trues, all_preds, average='macro', zero_division=0)
    
    print(f"Summary -> Train Loss: {epoch_train_loss:.4f} | Train Acc: {epoch_train_acc:.4f} | Val Loss: {epoch_val_loss:.4f} | Val Acc: {epoch_val_acc:.4f} | Val Macro F1: {epoch_f1:.4f}")
    
    # Guardar métricas en el historial
    history['epoch'].append(epoch + 1)
    history['train_loss'].append(epoch_train_loss)
    history['train_acc'].append(epoch_train_acc)
    history['val_loss'].append(epoch_val_loss)
    history['val_acc'].append(epoch_val_acc)
    history['val_f1'].append(epoch_f1)
    
    # Respaldar inmediatamente en un archivo CSV estable
    df_history = pd.DataFrame(history)
    df_history.to_csv(csv_log_path, index=False)
    
    if epoch_f1 > best_f1:
        best_f1 = epoch_f1
        torch.save(modelo.state_dict(), 'stego_cnn_v5_best.pt')
        print("⭐ ¡Modelo guardado como el mejor hasta ahora!")

print("\n" + "="*60)
print(" 📈 GENERANDO ANÁLISIS GRÁFICO E INFORMES FINALES")
print("="*60)

# ── Generación de Gráficas de Rendimiento (Loss y Accuracy) ────────────────────
print("Guardando curvas de aprendizaje ('stego_learning_curves.png')...")
plt.figure(figsize=(14, 5))

# Subplot 1: Función de Pérdida (Loss)
plt.subplot(1, 2, 1)
plt.plot(history['epoch'], history['train_loss'], label='Loss Entrenamiento', color='#1f77b4', linewidth=2)
plt.plot(history['epoch'], history['val_loss'], label='Loss Validación', color='#ff7f0e', linestyle='--', linewidth=2)
plt.title('Evolución de la Función de Pérdida (Loss)', fontsize=12, fontweight='bold')
plt.xlabel('Época', fontsize=10)
plt.ylabel('Pérdida (Loss)', fontsize=10)
plt.grid(True, linestyle=':', alpha=0.6)
plt.legend(fontsize=10)

# Subplot 2: Precisión (Accuracy) y F1-Score
plt.subplot(1, 2, 2)
plt.plot(history['epoch'], history['train_acc'], label='Acc Entrenamiento', color='#2ca02c', linewidth=2)
plt.plot(history['epoch'], history['val_acc'], label='Acc Validación', color='#d62728', linestyle='--', linewidth=2)
plt.plot(history['epoch'], history['val_f1'], label='Macro F1 Validación', color='#9467bd', linestyle=':', linewidth=2)
plt.title('Evolución de la Exactitud (Accuracy) y F1-Score', fontsize=12, fontweight='bold')
plt.xlabel('Época', fontsize=10)
plt.ylabel('Métrica (0.0 - 1.0)', fontsize=10)
plt.grid(True, linestyle=':', alpha=0.6)
plt.legend(fontsize=10)

plt.tight_layout()
plt.savefig('stego_learning_curves.png', dpi=300)
plt.close()

# ── Evaluación Final en el Conjunto de Test ──────────────────────────────────
print("Cargando el mejor modelo para evaluar en el conjunto de prueba (Test)...")
modelo.load_state_dict(torch.load('stego_cnn_v5_best.pt'))
modelo.eval()

test_preds, test_trues = [], []
with torch.no_grad():
    for srm, dct, labels in test_loader:
        srm, dct = srm.to(device), dct.to(device)
        outputs = modelo(srm, dct)
        _, predicted = outputs.max(1)
        test_preds.extend(predicted.cpu().numpy())
        test_trues.extend(labels.numpy())

# Convertir a arreglos numéricos para las métricas finales
test_trues = np.array(test_trues)
test_preds = np.array(test_preds)

print("\n── Classification Report (Test - PyTorch) ──")
reporte_str = classification_report(test_trues, test_preds, target_names=NOMBRES_CLASES, digits=4, zero_division=0)
print(reporte_str)

# Guardar el informe de texto para consulta directa
with open("stego_classification_report.txt", "w") as f:
    f.write(reporte_str)

# ── Generación de Matriz de Confusión Estilizada ──────────────────────────────
print("Guardando Matriz de Confusión Estilizada ('stego_confusion_matrix.png')...")
cm = confusion_matrix(test_trues, test_preds)

# Convertir a porcentajes por fila (frecuencia real)
cm_percentage = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis] * 100

plt.figure(figsize=(8, 6.5))
sns.heatmap(
    cm_percentage, 
    annot=True, 
    fmt=".2f", 
    cmap="Blues", 
    xticklabels=NOMBRES_CLASES, 
    yticklabels=NOMBRES_CLASES,
    cbar_kws={'label': 'Porcentaje de Aciertos (%)'},
    annot_kws={'size': 11, 'weight': 'bold'}
)

plt.title('Matriz de Confusión Final (Conjunto de Test %)', fontsize=14, fontweight='bold', pad=15)
plt.xlabel('Predicción del Modelo', fontsize=12, labelpad=10)
plt.ylabel('Clase Real (Ground Truth)', fontsize=12, labelpad=10)
plt.xticks(rotation=45)
plt.yticks(rotation=0)
plt.tight_layout()
plt.savefig('stego_confusion_matrix.png', dpi=300)
plt.close()

print("\n🎉 ¡Análisis completo! Archivos generados exitosamente:")
print(" -> 'stego_learning_curves.png'      (Gráficas de Loss y Acc)")
print(" -> 'stego_confusion_matrix.png'     (Matriz de Confusión)")
print(" -> 'stego_cnn_v5_log.csv'           (Historial de datos crudos)")
print(" -> 'stego_classification_report.txt' (Texto del Reporte Final)")
print("="*60)
