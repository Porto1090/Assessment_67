from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse

from app.compiler_engine.types import CompilerError
from app.compiler_engine.lexer import Lexer
from app.compiler_engine.parser import Parser
from app.compiler_engine.semantic import SemanticAnalyzer
from app.compiler_engine.generator import CodeGenerator

from app.services.file_manager import save_evidence, cleanup_evidence

router = APIRouter(
  prefix="/api/compiler",
  tags=["Compiler DSL"]
)

@router.post("/run")
async def run_compiler(
  code: str = Form(...),
  image: UploadFile = File(None),
):
  temp_file_path = None

  try:
    # 1. Manejo del "Evidence Locker" a través del servicio
    if image:
      temp_file_path = save_evidence(image)

    # 2. Pipeline del Compilador
    lexer = Lexer(code)
    tokens = lexer.tokenize()

    parser = Parser(tokens)
    ast = parser.parse()

    semantic = SemanticAnalyzer()
    symbol_table = semantic.analyze(ast)

    # VALIDACIÓN DEL LOCKER
    if image:
      for var_name, original_path in symbol_table.items():
        if original_path == image.filename:
          symbol_table[var_name] = temp_file_path
        else:
          raise CompilerError("Semantic", f"El archivo '{original_path}' en el LOAD no coincide con la evidencia subida '{image.filename}'.")

    # 3. Generación y Ejecución
    generator = CodeGenerator(ast, symbol_table)
    execution_results = generator.execute()

    return JSONResponse(
      status_code=200,
      content={
        "status": "success",
        "message": "Análisis y ejecución completados sin errores.",
        "details": execution_results
      }
    )

  except CompilerError as e:
    return JSONResponse(status_code=400, content={"status": "error", "type": e.type, "message": e.message})
  except Exception as e:
    return JSONResponse(status_code=500, content={"status": "error", "type": "System", "message": f"Fallo interno: {str(e)}"})
  finally:
    # CRÍTICA: Si borras la evidencia aquí, ¿cómo descargará el frontend la imagen con Encode?
    # Recomendación: Limpiar en un Cronjob o manejar las salidas en otro directorio.
    if temp_file_path:
        cleanup_evidence(temp_file_path)