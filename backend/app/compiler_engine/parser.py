from app.compiler_engine.types import TokenType, Token, LoadNode, HideNode, ExtractNode, CompilerError

class Parser:
  def __init__(self, tokens: list[Token]):
    self.tokens = tokens
    self.pos = 0
    self.current_token = self.tokens[self.pos]

  def eat(self, token_type: TokenType, expected_value: str = None):
    if self.current_token.type == token_type and (expected_value is None or self.current_token.value == expected_value):
      self.pos += 1
      self.current_token = self.tokens[self.pos]
    else:
      expected = expected_value if expected_value else token_type.name
      raise CompilerError("Syntax", f"Error en línea {self.current_token.line}: Se esperaba '{expected}', se encontró '{self.current_token.value}'.")

  def parse(self) -> list:
    statements = []
    while self.current_token.type != TokenType.EOF:
      if self.current_token.value == "LOAD":
        statements.append(self.parse_load())
      elif self.current_token.value == "HIDE":
        statements.append(self.parse_hide())
      elif self.current_token.value == "EXTRACT":
        statements.append(self.parse_extract())
      else:
        raise CompilerError("Syntax", f"Comando no reconocido: '{self.current_token.value}'.")
    return statements

  def parse_load(self):
    line = self.current_token.line
    self.eat(TokenType.KEYWORD, "LOAD")
    path = self.current_token.value
    self.eat(TokenType.STRING)
    self.eat(TokenType.KEYWORD, "AS")
    var = self.current_token.value
    self.eat(TokenType.VARIABLE)
    return LoadNode(path, var, line)

  def parse_hide(self):
    line = self.current_token.line
    self.eat(TokenType.KEYWORD, "HIDE")
    msg = self.current_token.value
    self.eat(TokenType.STRING)
    self.eat(TokenType.KEYWORD, "IN")
    var = self.current_token.value
    self.eat(TokenType.VARIABLE)
    self.eat(TokenType.KEYWORD, "USING")
    algo = self.current_token.value
    self.eat(TokenType.ALGORITHM)
    return HideNode(msg, var, algo, line)

  def parse_extract(self):
    line = self.current_token.line
    self.eat(TokenType.KEYWORD, "EXTRACT")
    self.eat(TokenType.KEYWORD, "FROM")
    var = self.current_token.value
    self.eat(TokenType.VARIABLE)
    return ExtractNode(var, line)