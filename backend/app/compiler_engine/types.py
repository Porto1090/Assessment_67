from enum import Enum
from dataclasses import dataclass
from typing import Any

class TokenType(Enum):
  KEYWORD = "KEYWORD"
  VARIABLE = "VARIABLE"
  STRING = "STRING"
  ALGORITHM = "ALGORITHM"
  EOF = "EOF"

class NodeType(Enum):
  LOAD = "LOAD"
  HIDE = "HIDE"
  EXTRACT = "EXTRACT"

class CompilerError(Exception):
  def __init__(self, type_: str, message: str):
    self.type = type_
    self.message = message
    super().__init__(self.message)

@dataclass
class Token:
  type: TokenType
  value: str
  line: int

class ASTNode:
  pass

@dataclass
class LoadNode(ASTNode):
  path: str
  variable: str
  line: int
  type: NodeType = NodeType.LOAD

@dataclass
class HideNode(ASTNode):
  message: str
  variable: str
  algorithm: str
  line: int
  type: NodeType = NodeType.HIDE

@dataclass
class ExtractNode(ASTNode):
  variable: str
  line: int
  type: NodeType = NodeType.EXTRACT