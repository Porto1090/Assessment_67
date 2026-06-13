from app.compiler_engine.types import NodeType
import requests
import os
import uuid  # <-- Importamos uuid para generar el id aleatorio
from dotenv import load_dotenv

# from app.stego_engine import encoder, decoder
from app.stego_engine.encoder import encoder
from app.stego_engine.decoder import decoder

load_dotenv()
INFERENCE_API_URL = os.getenv("INFERENCE_API_URL")

class CodeGenerator:
  def __init__(self, ast: list, symbol_table: dict):
    self.ast = ast
    self.symbol_table = symbol_table

  def execute(self):
    results = []
    for node in self.ast:
      
      # ==========================================
      # ENCODE (Ocultamiento) - Totalmente Local
      # ==========================================
      if node.type == NodeType.HIDE:
        image_path = self.symbol_table[node.variable]        
        try:
          output_path = encoder.apply_hide(
            image_path=image_path, 
            message=node.message, 
            algorithm=node.algorithm
          )
          
          results.append({
            "action": "encoded",
            "variable": node.variable,
            "algorithm": node.algorithm,
            "output_image": output_path
          })
        except Exception as e:
          results.append({"action": "encoded", "error": str(e)})

      # ==========================================
      # DECODE (Extracción) - Modelo Híbrido
      # ==========================================
      elif node.type == NodeType.EXTRACT:
        image_path = self.symbol_table[node.variable]
        
        try:
          # Enviamos la imagen a la API de Inferencia
          with open(image_path, "rb") as file_to_predict:
            
            # Generamos un ID aleatorio usando uuid4
            random_id = str(uuid.uuid4())
            
            response = requests.post(
              f"{INFERENCE_API_URL}/api/model", 
              data={"id": random_id},              # <-- 1. Agregado el ID aleatorio
              files={"file": file_to_predict}      # <-- 2. Cambiado de "image" a "file"
            )
              
          if not response.ok:
            raise Exception(f"La API de inferencia falló: {response.text}")
              
          inference_data = response.json()
          
          # 3. Ajustamos la forma de leer la respuesta de la IA (prediccion -> clase)
          prediccion_block = inference_data.get("prediccion", {})
          if isinstance(prediccion_block, str):
             raise Exception(f"Modelo inaccesible o en Demo: {prediccion_block}")
             
          detected_algorithm = prediccion_block.get("clase")
          
          # Si devuelve Cover o vacío, no intentamos extraer nada
          if not detected_algorithm or detected_algorithm == "Cover":
             results.append({
                 "action": "decoded",
                 "variable": node.variable,
                 "ai_prediction": detected_algorithm or "Cover",
                 "extracted_message": None,
                 "ai_metadata": inference_data
             })
             continue

          # Con el algoritmo detectado, ejecutamos nuestro Decoder Local
          # Usamos .lower() por seguridad para evitar errores de mayúsculas/minúsculas
          extracted_message = decoder.apply_extract(
            image_path=image_path, 
            algorithm=detected_algorithm.lower()
          )
          
          results.append({
            "action": "decoded",
            "variable": node.variable,
            "ai_prediction": detected_algorithm,
            "extracted_message": extracted_message,
            "ai_metadata": inference_data
          })
        except Exception as e:
          results.append({"action": "decoded", "error": str(e)})
              
    return results