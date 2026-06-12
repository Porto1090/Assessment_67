from app.compiler_engine.types import NodeType, CompilerError

class SemanticAnalyzer:
  def __init__(self):
    self.symbol_table = {}
    self.valid_algorithms = {"LSB", "DCT", "PVD"}

  def analyze(self, ast: list) -> dict:
    for node in ast:
      if node.type == NodeType.LOAD:
        if not (node.path.endswith('.jpg') or node.path.endswith('.png')):
          raise CompilerError("Semantic", f"Formato no soportado para '{node.path}' en línea {node.line}.")
        self.symbol_table[node.variable] = node.path
          
      elif node.type == NodeType.HIDE or node.type == NodeType.EXTRACT:
        if node.variable not in self.symbol_table:
          raise CompilerError("Semantic", f"Variable '{node.variable}' no declarada en línea {node.line}.")
        
        if node.type == NodeType.HIDE and node.algorithm not in self.valid_algorithms:
          raise CompilerError("Semantic", f"Algoritmo '{node.algorithm}' no soportado en línea {node.line}.")

    return self.symbol_table