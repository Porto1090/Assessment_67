from app.compiler_engine.types import NodeType
import requests
import os
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
          # Enviamos la imagen a la API de Inferencia para que nos diga qué algoritmo de esteganografía se usó
          with open(image_path, "rb") as file_to_predict:
            response = requests.post(
              f"{INFERENCE_API_URL}/api/predict", 
              files={"image": file_to_predict}
            )
              
          if not response.ok:
            raise Exception(f"La API de inferencia falló: {response.text}")
              
          inference_data = response.json()
          detected_algorithm = inference_data.get("algorithm")
          
          if not detected_algorithm:
            raise Exception("La API no devolvió un algoritmo válido.")

          # Con el algoritmo detectado, ejecutamos nuestro Decoder Local
          extracted_message = decoder.apply_extract(
            image_path=image_path, 
            algorithm=detected_algorithm
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