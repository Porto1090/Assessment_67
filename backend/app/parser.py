from enum import Enum
from .globalTypes import *
from . import lexer

class TipoExpresion(Enum):
  Program = 0 #programa completo
  Compound = 1 #bloque de código
  Call = 2 #funciones
  VarDecl = 3 #declaración de variable
  Function = 4 #declaración de función
  Conditional = 5 #if-else
  Selection = 6 #if sin else
  Param = 7 #parámetros de función
  Expression = 8 #sentencia de expresión
  Iteration = 9 #while
  Return = 10 #return
  Assign = 11 #variables
  Id = 12 #identificadores
  Op = 13 #operadores
  Const = 14 #numeros
  
class NodoArbol:
  def __init__(self):
    self.hijos = []
    self.tipo_expresion = None
    
    self.operador = None
    self.valor = None
    self.nombre = None
    
    self.argumentos = []
    self.indice = None
    
class Arbol:
  def __init__(self):
    self.raiz = None
    self.tokens = None
    self.pos = 0
    self.token = None
    
def globales(prog, pos, long):
  """Inicializa las variables globales necesarias para el lexer."""
  global programa, posicion, progLong
  programa = prog
  posicion = pos
  progLong = long
  lexer.globales(prog, pos, long)
  
def nuevo_nodo(tipo):
  t = NodoArbol()
  if t is None:
    print("Se terminó la memoria")
    return None
  t.tipo_expresion = tipo
  return t

class ErrorSintactico(Exception):
    """Excepción personalizada para manejar errores de sintaxis."""
    pass
  
def error_sintaxis(mensaje):
  global errores_sintacticos
  
  error = lexer.error_lexico(
    mensaje,
    lexer.posicion - 1,
    parser= True
  )
  errores_sintacticos.append(error)
  raise ErrorSintactico(mensaje)

def recuperacion_panico():
  global token
  
  # Necesitamos definir un conjunto de tokens de sincronización para la recuperación de pánico. 
  # Estos tokens indican puntos seguros en el código donde el parser puede reanudar el análisis después de un error.
  SYNC_TOKENS = {
    TokenType.TKN_SMC,
    TokenType.TKN_BRACE_CLOSE,
    TokenType.INT,
    TokenType.RETURN,
    TokenType.IF,
    TokenType.WHILE,
    TokenType.EOF
  }
  
  token = lexer.getToken(imprime=False)
  while tipo() not in SYNC_TOKENS:
    token = lexer.getToken(imprime=False)
  if tipo() == TokenType.TKN_SMC:
    token = lexer.getToken(imprime=False)
  
def imprime_espacios():
  print(' '*endentacion, end='')
  
def imprime_AST(arbol):
  global endentacion
  if arbol is None:
    return
  
  # Aumentamos la indentación para los hijos del nodo actual  
  endentacion += 2
  imprime_espacios()
  
  # Etiquetas para cada tipo de nodo, con información relevante
  etiquetas = {
    TipoExpresion.Program: lambda n: "Programa",
    TipoExpresion.Compound: lambda n: "Bloque de código",
    TipoExpresion.Call: lambda n: f"Llamada a función: {n.nombre}",
    TipoExpresion.VarDecl: lambda n: f"Declaración de variable: {n.nombre} de tipo {n.tipo}",
    TipoExpresion.Function: lambda n: f"Declaración de función: {n.nombre} de tipo {n.tipo}",
    TipoExpresion.Conditional: lambda n: "Sentencia condicional if-else",
    TipoExpresion.Selection: lambda n: "Sentencia condicional if",
    TipoExpresion.Param: lambda n: f"Parámetro: {n.nombre} de tipo {n.tipo}",
    TipoExpresion.Expression: lambda n: "Sentencia de expresión",
    TipoExpresion.Iteration: lambda n: "Sentencia while",
    TipoExpresion.Return: lambda n: "Sentencia return",
    TipoExpresion.Assign: lambda n: f"Asignación a variable",
    TipoExpresion.Id: lambda n: f"Variable: {n.nombre}",
    TipoExpresion.Op: lambda n: f"Operador: {n.operador}",
    TipoExpresion.Const: lambda n: f"Constante: {n.valor}",
  }

  print(etiquetas.get(
    arbol.tipo_expresion,
    lambda n: "Desconocido"
  )(arbol))

  for hijo in arbol.hijos:
    imprime_AST(hijo)
  endentacion -= 2
  
# Funciones auxiliares para el parser
def match(c):
  global token
  #print(f"Token: {tipo()}") #DEBUG
  if tipo() == c:
    token = lexer.getToken(imprime=False)
  else:
    error_sintaxis(f"Se esperaba {c} y llegó {tipo()} ('{valor()}')")

# Funciones para verificar el tipo de token actualy avanzar en la lista de tokens
def peek(n):
  prev_pos = lexer.posicion
  prev_linea = lexer.linea
  
  res = None
  for _ in range(n):
    res = lexer.getToken(imprime=False)
    
  lexer.posicion = prev_pos
  lexer.linea = prev_linea
  return res

# Conjunto de funciones para verificar el tipo de token actual y facilitar la escritura de las reglas gramaticales
def tipo():
  return token[0]

def valor():
  return token[1]

# Funciones para verificar si el token actual pertenece a ciertos conjuntos de tokens, facilitando la escritura de las reglas gramaticales
def es_nueva_expresion():
  return tipo() in [TokenType.NUM, TokenType.ID, TokenType.TKN_PAR_OPEN]

def es_addop():
  return tipo() in [TokenType.TKN_PLUS, TokenType.TKN_MINUS]

def es_mulop():
  return tipo() in [TokenType.TKN_MULT, TokenType.TKN_DIV]

def es_relop():
  return tipo() in [TokenType.TKN_LTE, TokenType.TKN_LT, TokenType.TKN_GTE, TokenType.TKN_GT, TokenType.TKN_EQ, TokenType.TKN_NEQ]

# EMPEZAMOS CON EL PARSER RECURSIVO DESCENDENTE PARA EBNF

# program ::= declaration { declaration }
def program():
  p = nuevo_nodo(TipoExpresion.Program)
  while tipo() != TokenType.EOF:
    try:
      decl = declaration()
      if decl:
        p.hijos.append(decl)
    except ErrorSintactico:
      recuperacion_panico()
  return p

# declaration ::= var_declaration | fun_declaration
def declaration():
  if tipo() == TokenType.INT:
    if peek(1)[0] != TokenType.ID:
      error_sintaxis("Se esperaba ID después del tipo")

    if peek(2)[0] == TokenType.TKN_PAR_OPEN:
      return fun_declaration()
    else:
      return var_declaration()
  else:
    error_sintaxis("Se esperaba tipo de dato")
  
# var_declaration ::= type_specifier ID [ "[" NUM "]" ] ";"
def var_declaration():
  p = nuevo_nodo(TipoExpresion.VarDecl)
  p.tipo = valor()
  match(tipo())
  
  p.nombre = valor()
  match(TokenType.ID)
  
  if tipo() == TokenType.TKN_BRACKET_OPEN:
    match(TokenType.TKN_BRACKET_OPEN)
    if tipo() == TokenType.NUM:
      p.tamano = valor()
      match(TokenType.NUM)
    else:
      error_sintaxis("Se esperaba un número para el tamaño del arreglo")
    match(TokenType.TKN_BRACKET_CLOSE)
    
  match(TokenType.TKN_SMC)
  return p

# type_specifier ::= "int" | void
def type_specifier():
  if tipo() in [TokenType.INT, TokenType.VOID]:
    t = valor()
    match(tipo())
    return t
  else:
    error_sintaxis("Se esperaba un tipo de dato")
    return None

# fun_declaration ::= type_specifier ID "(" params ")" compound_stmt
def fun_declaration():
  p = nuevo_nodo(TipoExpresion.Function)
  p.tipo = valor()
  match(tipo())
  
  p.nombre = valor()
  match(TokenType.ID)
  
  match(TokenType.TKN_PAR_OPEN)
  p.parametros = params()
  match(TokenType.TKN_PAR_CLOSE)
  
  p.hijos.append(compound_stmt())
  return p

# params ::= void | param { "," param }
def params():
  parametros = []
  
  # caso: vacio -> ()
  if tipo() == TokenType.TKN_PAR_CLOSE:
    return parametros
  
  if tipo() == TokenType.VOID:
    match(TokenType.VOID)
    return parametros
  
  # caso: valores -> (int x, int y)
  parametros.append(param())
  while tipo() == TokenType.TKN_CMA:
    match(TokenType.TKN_CMA)
    parametros.append(param())
  return parametros

# param ::= type_specifier ID [ "[" "]" ]
def param():
  p = nuevo_nodo(TipoExpresion.Param)
  
  if tipo() != TokenType.INT:
    error_sintaxis("Se esperaba tipo int en parámetro")
    
  p.tipo = valor()
  match(tipo())
    
  if tipo() != TokenType.ID:
    error_sintaxis("Se esperaba un ID para el parámetro")
    
  p.nombre = valor()
  match(TokenType.ID)
  if tipo() == TokenType.TKN_BRACKET_OPEN:
    match(TokenType.TKN_BRACKET_OPEN)
    match(TokenType.TKN_BRACKET_CLOSE)
  return p

# compound_stmt ::= "{" { var_declaration } { statement } "}"
def compound_stmt():
  p = nuevo_nodo(TipoExpresion.Compound)
  match(TokenType.TKN_BRACE_OPEN)

  while tipo() in [TokenType.INT]:
    try:
      p.hijos.append(var_declaration())
    except ErrorSintactico:
          recuperacion_panico()
  while tipo() != TokenType.TKN_BRACE_CLOSE and tipo() != TokenType.EOF:
    try:
      stmt = statement()
      if stmt:
        p.hijos.append(stmt)
    except ErrorSintactico:
      recuperacion_panico()

  match(TokenType.TKN_BRACE_CLOSE)
  return p
  
# statement ::= expression_stmt | compound_stmt | selection_stmt | iteration_stmt | return_stmt
def statement():
  if tipo() == TokenType.TKN_BRACE_OPEN:
    return compound_stmt()
  elif tipo() == TokenType.IF:
    return selection_stmt()
  elif tipo() == TokenType.WHILE:
    return iteration_stmt()
  elif tipo() == TokenType.RETURN:
    return return_stmt()
  else:
    return expression_stmt()

# expression_stmt ::= [ expression ] ";"
def expression_stmt():
  if tipo() != TokenType.TKN_SMC:
    exp = expression()
  else:
    exp = None
  match(TokenType.TKN_SMC)
  p = nuevo_nodo(TipoExpresion.Expression)
  p.hijos = [exp] if exp else []
  return p

# selection_stmt ::= "if" "(" expression ")" statement [ "else" statement ]
def selection_stmt():
  match(TokenType.IF)
  match(TokenType.TKN_PAR_OPEN)
  exp = expression()
  match(TokenType.TKN_PAR_CLOSE)
  stmt_then = statement()
  
  if tipo() == TokenType.ELSE:
    match(TokenType.ELSE)
    stmt_else = statement()
    p = nuevo_nodo(TipoExpresion.Conditional)
    p.hijos = [exp, stmt_then, stmt_else]
    return p
  else:
    p = nuevo_nodo(TipoExpresion.Selection)
    p.hijos = [exp, stmt_then]
    return p

# iteration_stmt ::= "while" "(" expression ")" statement
def iteration_stmt():
  match(TokenType.WHILE)
  match(TokenType.TKN_PAR_OPEN)
  exp = expression()
  match(TokenType.TKN_PAR_CLOSE)
  stmt = statement()
  p = nuevo_nodo(TipoExpresion.Iteration)
  p.hijos = [exp, stmt]
  return p

# return_stmt ::= "return" [ expression ] ";"
def return_stmt():
  match(TokenType.RETURN)
  if tipo() != TokenType.TKN_SMC:
    exp = expression()
  else:
    exp = None
  match(TokenType.TKN_SMC)
  p = nuevo_nodo(TipoExpresion.Return)
  p.hijos = [exp] if exp else []
  return p

# expression ::= var "=" expression | simple_expression
def expression():
  if tipo() == TokenType.ID:
    if peek(1)[0] in [TokenType.TKN_ASG, TokenType.TKN_BRACKET_OPEN]:
      izquierda = var()
      if tipo() == TokenType.TKN_ASG:
        match(TokenType.TKN_ASG)
        p = nuevo_nodo(TipoExpresion.Assign)
        p.operador = valor()
        p.hijos = [izquierda, expression()]
        return p
      return izquierda
  return simple_expression()

# var ::= ID [ "[" expression "]" ]
def var():
  if tipo() == TokenType.ID:
    p = nuevo_nodo(TipoExpresion.Id)
    p.nombre = valor()
    match(TokenType.ID)
    if tipo() == TokenType.TKN_BRACKET_OPEN:
      match(TokenType.TKN_BRACKET_OPEN)
      p.indice = expression()
      match(TokenType.TKN_BRACKET_CLOSE)
    return p
  else:
    error_sintaxis("Se esperaba un ID")
    return None

# simple_expression ::= additive_expression [ relop additive_expression ]
def simple_expression():
  t = additive_expression()
  if es_relop():
    op = relop()
    t2 = additive_expression()
    p = nuevo_nodo(TipoExpresion.Op)
    p.operador = op
    p.hijos = [t, t2]
    return p
  else:
    return t

# relop ::= "<=" | "<" | ">" | ">=" | "==" | "!="
def relop():
  op = valor()
  if tipo() == TokenType.TKN_LTE:
    match(TokenType.TKN_LTE)
  elif tipo() == TokenType.TKN_LT:
    match(TokenType.TKN_LT)
  elif tipo() == TokenType.TKN_GTE:
    match(TokenType.TKN_GTE)
  elif tipo() == TokenType.TKN_GT:
    match(TokenType.TKN_GT)
  elif tipo() == TokenType.TKN_EQ:
    match(TokenType.TKN_EQ)
  elif tipo() == TokenType.TKN_NEQ:
    match(TokenType.TKN_NEQ)
  else:
    error_sintaxis("Se esperaba un operador relacional")
    return None
  return op

# additive_expression ::= term { addop term }
def additive_expression():
  t = term()
  while es_addop():
    op = addop()
    t2 = term()
    p = nuevo_nodo(TipoExpresion.Op)
    p.operador = op
    p.hijos = [t, t2]
    t = p
  return t

# addop ::= "+" | "-"
def addop():
  op = valor()
  if tipo() == TokenType.TKN_PLUS:
    match(TokenType.TKN_PLUS)
  elif tipo() == TokenType.TKN_MINUS:
    match(TokenType.TKN_MINUS)
  else:
    error_sintaxis("Se esperaba un operador de suma o resta")
    return None
  return op

# term ::= factor { mulop factor }
def term():
  t = factor()
  while es_mulop():
    op = mulop()
    t2 = factor()
    p = nuevo_nodo(TipoExpresion.Op)
    p.operador = op
    p.hijos = [t, t2]
    t = p
  return t

# mulop ::= "*" | "/"
def mulop():
  if tipo() == TokenType.TKN_MULT:
    match(TokenType.TKN_MULT)
    return valor()
  elif tipo() == TokenType.TKN_DIV:
    match(TokenType.TKN_DIV)
    return valor()
  else:
    error_sintaxis("Se esperaba un operador de multiplicación o división")
    return None

# factor ::= "(" expression ")" | var | call | NUM
def factor():
  # NUM
  if tipo() == TokenType.NUM:
    p = nuevo_nodo(TipoExpresion.Const)
    p.valor = valor()
    match(TokenType.NUM)
    return p

  # ID → puede ser var, arreglo o función
  elif tipo() == TokenType.ID:
    nombre = valor()
    match(TokenType.ID)

    # call → f(...)
    if tipo() == TokenType.TKN_PAR_OPEN:
      return call(nombre)

    # array → a[...]
    elif tipo() == TokenType.TKN_BRACKET_OPEN:
      p = nuevo_nodo(TipoExpresion.Id)
      p.nombre = nombre

      match(TokenType.TKN_BRACKET_OPEN)
      index = expression()
      match(TokenType.TKN_BRACKET_CLOSE)

      p.hijos.append(index)
      return p

    # variable simple → a
    else:
      p = nuevo_nodo(TipoExpresion.Id)
      p.nombre = nombre
      return p

  # ( expression )
  elif tipo() == TokenType.TKN_PAR_OPEN:
    match(TokenType.TKN_PAR_OPEN)
    t = expression()
    match(TokenType.TKN_PAR_CLOSE)
    return t

  else:
    error_sintaxis(f"factor inválido -> {tipo()}")

# call ::= ID "(" args ")"
def call(nombre):
  p = nuevo_nodo(TipoExpresion.Call)
  p.nombre = nombre

  match(TokenType.TKN_PAR_OPEN)
  p.argumentos = args()
  match(TokenType.TKN_PAR_CLOSE)
  return p
      
# args ::= [ expression { "," expression } ]
def args():
  argumentos = []
  if es_nueva_expresion():
    argumentos.append(expression())
    while tipo() == TokenType.TKN_CMA:
      match(TokenType.TKN_CMA)
      argumentos.append(expression())
  return argumentos

def ast_to_dict(node):
  if node is None:
    return None

  result = {
    "type": node.tipo_expresion.name if node.tipo_expresion else None,
    "children": [ast_to_dict(child) for child in node.hijos if child is not None],
  }

  if hasattr(node, "nombre"):
    result["name"] = node.nombre

  if hasattr(node, "valor"):
    result["value"] = node.valor

  if hasattr(node, "operador"):
    result["operator"] = node.operador

  if hasattr(node, "tipo"):
    result["dataType"] = node.tipo

  if hasattr(node, "tamano"):
    result["size"] = node.tamano

  if hasattr(node, "indice") and node.indice is not None:
    result["index"] = ast_to_dict(node.indice)

  if hasattr(node, "argumentos") and node.argumentos:
    result["arguments"] = [
      ast_to_dict(arg)
      for arg in node.argumentos
      if arg is not None
    ]

  if hasattr(node, "parametros") and node.parametros:
    result["params"] = [
      ast_to_dict(param)
      for param in node.parametros
      if param is not None
    ]

  return result

# FUNCIÓN PRINCIPAL DEL PARSER
def parser(imprime=True):
  global token, endentacion, errores_sintacticos
  
  errores_sintacticos = []
  token = lexer.getToken(imprime=False)
  endentacion = 0
  
  if tipo() == TokenType.EOF:
    return {
      "ast": None,
      "lexical_errors": lexer.get_errores(),
      "syntax_errors": [],
    }

  AST = program()
  if tipo() != TokenType.EOF:
    error_sintaxis("El código termina antes que el archivo")
  
  if imprime:
    imprime_AST(AST)
    
  # NECESARIO PARA SER INTERPRETABLE POR EL FRONTEND, CONVERTIMOS EL AST A UN FORMATO DE DICCIONARIO ANIDADO
  AST = ast_to_dict(AST)
    
  return {
    "ast": AST,
    "lexical_errors": lexer.get_errores(),
    "syntax_errors": errores_sintacticos,
  }