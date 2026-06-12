import os
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import requests
from dotenv import load_dotenv

from app.stego_engine.encoder import encoder
from app.stego_engine.decoder import decoder

load_dotenv()
INFERENCE_API_URL = os.getenv("INFERENCE_API_URL")

router = APIRouter(
	prefix="/api/stego",
	tags=["Steganography Engine"]
)

TMP_DIR = Path("tmp_stego_processing")
TMP_DIR.mkdir(exist_ok=True)

@router.post("/encode")
async def encode_image(
	message: str = Form(...),
	algorithm: str = Form(...),
	file: UploadFile = File(...)
):
	"""
	Endpoint para OCULTAR un mensaje dentro de una imagen usando un algoritmo específico (Local).
	"""
	temp_input_path = TMP_DIR / file.filename
	try:
		with open(temp_input_path, "wb") as buffer:
			shutil.copyfileobj(file.file, buffer)

		output_image_path = encoder.apply_hide(
			image_path=str(temp_input_path),
			message=message,
			algorithm=algorithm.lower()
		)

		return {
			"status": "success",
			"action": "encoded",
			"algorithm_used": algorithm,
			"output_image_path": output_image_path
		}

	except Exception as e:
		raise HTTPException(status_code=500, detail=f"Error en el proceso de codificación: {str(e)}")
	finally:
		if temp_input_path.exists():
			os.remove(temp_input_path)


@router.post("/decode")
async def decode_image(file: UploadFile = File(...)):
	"""
	Endpoint HÍBRIDO para EXTRAER un mensaje. Siempre incluye la telemetría de la IA (ai_metadata).
	"""
	temp_input_path = TMP_DIR / file.filename
	try:
		# 1. Guardar archivo recibido temporalmente
		with open(temp_input_path, "wb") as buffer:
			shutil.copyfileobj(file.file, buffer)

		# 2. CONSULTA HÍBRIDA A LA IA
		with open(temp_input_path, "rb") as file_to_predict:
			# Asegurar la ruta correcta eliminando barras duplicadas
			url_limpia = f"{INFERENCE_API_URL}/api/model"
			response = requests.post(
				url_limpia,
				data={"id": "api_decoder_stream"},
				files={"file": file_to_predict} 
			)

		if not response.ok:
			raise HTTPException(
				status_code=502, 
				detail=f"La API de inferencia de IA falló o no está disponible: {response.text}"
			)

		inference_data = response.json()
		
		prediccion_block = inference_data.get("prediccion", {})
		if isinstance(prediccion_block, str):
			raise HTTPException(status_code=400, detail=f"El modelo está en Modo Demo o inaccesible: {prediccion_block}")
				
		detected_algorithm = prediccion_block.get("clase")

		# Caso A: La IA determina que es una Cover (Limpia) o no devuelve clase válida
		if not detected_algorithm or detected_algorithm == "Cover":
			return {
				"status": "success",
				"action": "decoded",
				"ai_prediction": detected_algorithm,
				"extracted_message": None,
				"ai_metadata": inference_data
			}

		# Caso B: Algoritmo de esteganografía detectado -> Extraer localmente
		extracted_message = decoder.apply_extract(
				image_path=str(temp_input_path),
				algorithm=detected_algorithm.lower()
		)

		return {
			"status": "success",
			"action": "decoded",
			"ai_prediction": detected_algorithm,
			"extracted_message": extracted_message,
			"ai_metadata": inference_data
		}

	except HTTPException as http_e:
		raise http_e
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"Error en el proceso de decodificación híbrida: {str(e)}")
	finally:
		if temp_input_path.exists():
			os.remove(temp_input_path)