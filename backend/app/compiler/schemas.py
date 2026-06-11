from pydantic import BaseModel

class CompileRequest(BaseModel):
  source_code: str

class CompileResponse(BaseModel):
  run: dict
  ast: dict | list | None = None