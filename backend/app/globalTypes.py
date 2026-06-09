from enum import Enum

class TokenType(Enum):
  ERROR = 'ERROR'
  EOF = 'EOF'
  
  NUM = 'NUM'
  ID = 'ID'
  
  TKN_PLUS = '+'
  TKN_MINUS = '-'
  TKN_MULT = '*'
  TKN_DIV = '/'
  
  TKN_LT = '<'
  TKN_LTE = '<='
  TKN_GT = '>'
  TKN_GTE = '>='
  TKN_EQ = '=='
  TKN_NEQ = '!='
  
  TKN_ASG = '='
  TKN_SMC = ';'
  TKN_CMA = ','
  
  TKN_PAR_OPEN = '('
  TKN_PAR_CLOSE = ')'
  TKN_BRACE_OPEN = '{'
  TKN_BRACE_CLOSE = '}'
  TKN_BRACKET_OPEN = '['
  TKN_BRACKET_CLOSE = ']'
  
  TKN_COMMENT = '/*...*/'
  
  INT    = 'int'
  VOID   = 'void'
  IF     = 'if'
  ELSE   = 'else'
  WHILE  = 'while'
  RETURN = 'return'
  
RESERVED_WORDS = {
  'int':    TokenType.INT,
  'void':   TokenType.VOID,
  'if':     TokenType.IF,
  'else':   TokenType.ELSE,
  'while':  TokenType.WHILE,
  'return': TokenType.RETURN,
}

ACCEPTING_STATE_TOKEN = {
  10: TokenType.NUM, 
  11: TokenType.ID,
  12: TokenType.TKN_DIV,
  13: TokenType.TKN_COMMENT,
  14: TokenType.TKN_LTE,
  15: TokenType.TKN_LT,
  16: TokenType.TKN_GTE,
  17: TokenType.TKN_GT,
  18: TokenType.TKN_EQ,
  19: TokenType.TKN_ASG,
  20: TokenType.TKN_NEQ,
  21: TokenType.TKN_PLUS,
  22: TokenType.TKN_MINUS,
  23: TokenType.TKN_MULT,
  24: TokenType.TKN_SMC,
  25: TokenType.TKN_CMA,
  26: TokenType.TKN_PAR_OPEN,
  27: TokenType.TKN_PAR_CLOSE,
  28: TokenType.TKN_BRACE_OPEN,
  29: TokenType.TKN_BRACE_CLOSE,
  30: TokenType.TKN_BRACKET_OPEN,
  31: TokenType.TKN_BRACKET_CLOSE,
}