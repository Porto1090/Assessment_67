from app.compiler_engine.types import TokenType, Token, CompilerError

class Lexer:
  def __init__(self, text: str):
    self.text = text
    self.pos = 0
    self.line = 1
    self.current_char = self.text[self.pos] if self.text else None
    self.keywords = {"LOAD", "AS", "HIDE", "IN", "USING", "EXTRACT", "FROM"}

  def advance(self):
    self.pos += 1
    self.current_char = self.text[self.pos] if self.pos < len(self.text) else None

  def tokenize(self) -> list[Token]:
    tokens = []
    while self.current_char is not None:
      if self.current_char.isspace():
        if self.current_char == '\n':
          self.line += 1
        self.advance()
        continue
      
      if self.current_char == '$':
        self.advance()
        var_name = "$"
        while self.current_char is not None and self.current_char.isalnum():
          var_name += self.current_char
          self.advance()
        tokens.append(Token(TokenType.VARIABLE, var_name, self.line))
        continue
      
      if self.current_char == '"':
        self.advance()
        string_val = ""
        while self.current_char is not None and self.current_char != '"':
          string_val += self.current_char
          self.advance()
        if self.current_char != '"':
          raise CompilerError("Lexical", f"String no cerrado en línea {self.line}.")
        self.advance()
        tokens.append(Token(TokenType.STRING, string_val, self.line))
        continue
      
      if self.current_char.isalpha():
        id_str = ""
        while self.current_char is not None and self.current_char.isalpha():
          id_str += self.current_char
          self.advance()
        id_upper = id_str.upper()
        if id_upper in self.keywords:
          tokens.append(Token(TokenType.KEYWORD, id_upper, self.line))
        else:
          tokens.append(Token(TokenType.ALGORITHM, id_upper, self.line))
        continue
          
      raise CompilerError("Lexical", f"Carácter '{self.current_char}' no reconocido en línea {self.line}.")
        
    tokens.append(Token(TokenType.EOF, "", self.line))
    return tokens