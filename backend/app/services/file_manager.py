import os
import shutil
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "temp_evidence"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_evidence(image: UploadFile) -> str:
  """Guarda el archivo subido de forma segura y devuelve la ruta temporal."""
  session_id = str(uuid.uuid4())[:8]
  safe_filename = f"{session_id}_{image.filename}"
  temp_file_path = os.path.join(UPLOAD_DIR, safe_filename)
  
  with open(temp_file_path, "wb") as buffer:
    shutil.copyfileobj(image.file, buffer)
      
  return temp_file_path

def cleanup_evidence(filepath: str):
  """Elimina la evidencia del sistema para no saturar el servidor."""
  if filepath and os.path.exists(filepath):
    try:
      os.remove(filepath)
    except Exception as e:
      print(f"[FileManager Error] No se pudo eliminar {filepath}: {e}")