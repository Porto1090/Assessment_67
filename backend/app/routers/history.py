from datetime import datetime
from uuid import uuid4
from typing import List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.database import history_collection 

router = APIRouter(
  prefix="/api/history",
  tags=["historial"]
)

# ----------------------------------------------------------------------
# ESQUEMAS DE VALIDACIÓN (Pydantic)
# ----------------------------------------------------------------------

class CrearHistorialRequest(BaseModel):
  """
  Estructura JSON que recibe el Logger desde el endpoint del modelo
  o del frontend para registrar la transacción.
  """
  id_usuario: str = Field(..., example="equipo67")
  tipo_operacion: str = Field(..., example="DECODEAR", description="Debe ser ENCODEAR o DECODEAR")
  image_path: str = Field(..., example="storage/historial_images/foto_post.png")
  algoritmo_encriptado: str = Field("LSB Sequential", example="LSB Sequential")
  estado: str = Field(..., example="Detectado")
  confianza: float = Field(..., example=0.9997)


class HistorialRegistroResponse(BaseModel):
  """
  Estructura JSON de salida que cumple exactamente con los requisitos solicitados.
  """
  id_registro: str
  id_usuario: str
  tipo_operacion: str
  timestamp: str
  image_path: str
  algoritmo_encriptado: str
  estado: str
  confianza: float

# ----------------------------------------------------------------------
# ENDPOINTS CON CONEXIÓN REAL A MONGODB (MOTOR)
# ----------------------------------------------------------------------

@router.post("", response_model=HistorialRegistroResponse, status_code=status.HTTP_201_CREATED)
async def crear_historial(payload: CrearHistorialRequest):
  """
  [Task]: POST /api/history
  Crea y guarda un nuevo registro en MongoDB cada vez que un usuario consume el modelo.
  """
  # Validación del tipo de operación solicitado
  if payload.tipo_operacion not in ["ENCODEAR", "DECODEAR"]:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST, 
      detail="tipo_operacion inválido. Debe ser 'ENCODEAR' o 'DECODEAR'."
    )

  try:
    nuevo_log = {
      "id_registro": str(uuid4()),
      "id_usuario": payload.id_usuario,
      "tipo_operacion": payload.tipo_operacion,
      "timestamp": datetime.utcnow().isoformat() + "Z",
      "image_path": payload.image_path,
      "algoritmo_encriptado": payload.algoritmo_encriptado,
      "estado": payload.estado,
      "confianza": payload.confianza
    }

    await history_collection.insert_one(nuevo_log)
    return nuevo_log

  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
      detail=f"Error al escribir en la base de datos MongoDB: {str(e)}"
    )


@router.get("/{id_usuario}", response_model=List[HistorialRegistroResponse])
async def obtener_historial_usuario(id_usuario: str):
  """
  [Task]: GET /api/history/{id_usuario}
  Devuelve la lista completa de registros de uso de ese usuario en específico extraídos de MongoDB.
  """
  try:
    # 1. Buscamos en MongoDB todos los documentos que coincidan con el id_usuario
    # y los ordenamos cronológicamente (los más nuevos primero: timestamp -1)
    cursor = history_collection.find({"id_usuario": id_usuario}).sort("timestamp", -1)
    
    # 2. Convertimos el cursor asíncrono de Motor a una lista de Python (leemos hasta un límite prudente, ej: 500)
    registros_db = await cursor.to_list(length=500)
    
    # 3. Quitamos el campo '_id' interno de MongoDB de la respuesta (no es necesario por el esquema Pydantic)
    for reg in registros_db:
      reg.pop('_id', None)
        
    return registros_db

  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
      detail=f"Error al recuperar datos desde MongoDB: {str(e)}"
    )