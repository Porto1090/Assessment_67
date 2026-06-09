from .globalTypes import *

TABLE = [
  [0, 1, 2, 21, 22, 23, 3, 24, 6, 25, 26, 7, 27, 8, 28, 9, 29, 30, 31, 32],
  [10, 1, 32, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  [11, 32, 2, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
  [12, 12, 12, 12, 12, 4, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
  [4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  [4, 4, 4, 4, 4, 4, 13, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15],
  [17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 16, 17, 17, 17, 17, 17, 17],
  [19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 18, 19, 19, 19, 19, 19, 19],
  [32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 20, 32, 32, 32, 32, 32, 32],
]

# Estado de ERROR en la tabla de transiciones
ERROR_STATE = 32

# Estados que requieren hacer "unget" (no consumir el último caracter leído)
UNGET_STATES = {10, 11, 12, 15, 17, 19}

# Columns of the transition table (0-based), matching the CSV order:
#   blank d  l  +  -  *  /  ;  <  ,   (  >   )   =   {   !    }   [  ]  otro 
#   0     1  2  3  4  5  6  7  8  9  10  11  12  13  14  15  16  17  18  19

def _get_column(c: str) -> int:
  """Devuelve el índice de la columna en la tabla para el caracter *c*."""
  if c.isspace(): return 0
  if c.isdigit(): return 1
  if c.isalpha(): return 2
  if c == '+': return 3
  if c == '-': return 4
  if c == '*': return 5
  if c == '/': return 6
  if c == ';': return 7
  if c == '<': return 8
  if c == ',': return 9
  if c == '(': return 10
  if c == '>': return 11
  if c == ')': return 12
  if c == '=': return 13
  if c == '{': return 14
  if c == '!': return 15
  if c == '}': return 16
  if c == '[': return 17
  if c == ']': return 18
  return 19 # Cualquier otro caracter no reconocido en el alfabeto
  

def globales(prog, pos, long):
  """Inicializa las variables globales necesarias para el lexer."""
  global programa, posicion, progLong, linea, errores_lexicos
  programa = prog
  posicion = pos
  progLong = long
  linea = 1
  errores_lexicos = []
  
    
def getToken(imprime= True):
  global linea, posicion, progLong, programa

  while True:
    state = 0
    lexema = ""
    token = None
    next_state = 0
    
    # Ciclo principal para avanzar en el autómata
    while state not in ACCEPTING_STATE_TOKEN and state != ERROR_STATE:
      #print(f"DEBUG: state={state}, char='{programa[posicion]}'")
      
      # Verificamos si llegamos al final del archivo
      if posicion >= progLong or programa[posicion] == '$':
        return TokenType.EOF, '$'
      
      c = programa[posicion]
      col = _get_column(c)
      
      next_state = TABLE[state][col]
      
      # Manejo de ERRORES y mecanismo de RECUPERACIÓN
      if next_state == ERROR_STATE:
        # Se reporta el error indicando la posición exacta
        error_lexico("Caracter no válido o malformación de token", posicion)
        posicion += 1   # Recuperación: saltamos el caracter problemático para continuar buscando tokens
        break           # Rompemos el ciclo interno para reiniciar la búsqueda de un nuevo token
      
      # Si llegamos a un estado de UNGET, significa que el token terminó en el caracter anterior
      if next_state in UNGET_STATES:
        state = next_state
        break
      
      # Apuntador +1 
      posicion += 1
      
      # Construimos el lexema ignorando espacios en blanco en el estado inicial
      if not (state == 0 and c.isspace()):
        lexema += c
        
      # Llevamos el conteo de líneas
      if c == '\n':
        linea += 1
        
      state = next_state
    
    # Si el ciclo se rompió por un error, reiniciamos el while exterior
    if next_state == ERROR_STATE:
      continue
    
    token = ACCEPTING_STATE_TOKEN[state]
    
    if token == TokenType.TKN_COMMENT:
      continue
    
    if token not in (TokenType.NUM, TokenType.ID):
      tokenString = token.value
    else:
      tokenString = lexema
      # Si es un ID, verificamos si en realidad es una palabra reservada
      if token == TokenType.ID:
        token = RESERVED_WORDS.get(tokenString, TokenType.ID)

    if imprime:
      print(f"(\"{token.name}\", \"{tokenString}\")")

    return token, tokenString

def error_lexico(mensaje, error_pos, parser=False):
  """
  Imprime la línea exacta donde se encontró el error y coloca 
  un símbolo '^' apuntando al caracter infractor.
  """
  global programa, linea, errores_lexicos
  
  # Buscar el inicio y fin de la línea actual en el string del programa
  inicio_linea = programa.rfind('\n', 0, error_pos)
  inicio_linea = inicio_linea + 1 if inicio_linea != -1 else 0
  
  fin_linea = programa.find('\n', error_pos)
  if fin_linea == -1:
    fin_linea = len(programa)
      
  # Extraer la línea completa
  linea_completa = programa[inicio_linea:fin_linea].replace('$', '')
  
  # Calcular en qué columna de la línea está el error
  columna = error_pos - inicio_linea
  
  error = {
    "line": linea,
    "column": columna + 1,
    "message": mensaje,
    "source": linea_completa,
    "pointer": columna,
    "type": "parser" if parser else "lexer",
  }

  if not parser:
    errores_lexicos.append(error)

  return error

def get_errores():
  global errores_lexicos
  return errores_lexicos