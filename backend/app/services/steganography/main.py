"""
Punto de entrada único para todas las operaciones de esteganografía.

COMANDOS:

  dataset   Prepara imágenes y genera versiones esteganografiadas
  encode    Oculta un mensaje en una imagen específica
  decode    Recupera el mensaje de una imagen específica

EJEMPLOS:

  python main.py dataset --carpeta imagenes/
  python main.py dataset --carpeta imagenes/ --mensaje "texto" --salida output/

  python main.py encode --imagen foto.png --algoritmo bpcs --mensaje "Hola"
  python main.py encode --imagen foto.png --algoritmo dct  --mensaje "Hola"
  python main.py encode --imagen foto.png --algoritmo pvd  --mensaje "Hola"

  python main.py decode --imagen foto_estego_bpcs.png --algoritmo bpcs
  python main.py decode --imagen foto_estego_dct.png  --algoritmo dct
  python main.py decode --imagen foto_estego_pvd.png  --algoritmo pvd
"""

import os
import sys
import argparse

from bpcs import BPCS
from dct  import DCT
from pvd import PVD
from lsb import LSB

# =====================================
# CONSTANTES
# =====================================

ALGORITMOS = {"bpcs": BPCS, "dct": DCT, "pvd": PVD, "lsb": LSB}
FORMATOS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff", ".tif", ".gif"}
MENSAJE_DEFAULT = "Mensaje de prueba dataset"

# =====================================
# DATASET
# =====================================

def cmd_dataset(args):
	carpeta_entrada = args.carpeta
	carpeta_salida  = args.salida

	if not os.path.isdir(carpeta_entrada):
		print(f"Error: '{carpeta_entrada}' no es una carpeta válida")
		sys.exit(1)
	imagenes = sorted([
		f for f in os.listdir(carpeta_entrada)
		if os.path.splitext(f)[1].lower() in FORMATOS
	])

	if not imagenes:
		print(f"No se encontraron imágenes en '{carpeta_entrada}'")
		sys.exit(1)

	print(f"\nImágenes encontradas: {len(imagenes)}")

	carpetas = {
		"originales":  os.path.join(carpeta_salida, "original"),
		"estego_bpcs": os.path.join(carpeta_salida, "bpcs"),
		"estego_dct":  os.path.join(carpeta_salida, "dct"),
		"estego_pvd":  os.path.join(carpeta_salida, "pvd"),
		"estego_lsb":  os.path.join(carpeta_salida, "lsb"),
	}

	for c in carpetas.values():
		os.makedirs(c, exist_ok=True)

	bpcs = BPCS()
	dct  = DCT()
	pvd  = PVD()
	lsb = LSB()

	errores = []

	for i, nombre in enumerate(imagenes, 1):
		nombre_og     = f"img_{i:02d}_og.png"
		nombre_bpcs   = f"img_{i:02d}_bpcs.png"
		nombre_dct    = f"img_{i:02d}_dct.png"
		nombre_pvd    = f"img_{i:02d}_pvd.png"
		nombre_lsb    = f"img_{i:02d}_lsb.png"

		ruta_original  = os.path.join(carpeta_entrada,         nombre)
		ruta_preparada = os.path.join(carpetas["originales"],  nombre_og)
		ruta_bpcs      = os.path.join(carpetas["estego_bpcs"], nombre_bpcs)
		ruta_dct       = os.path.join(carpetas["estego_dct"],  nombre_dct)
		ruta_pvd       = os.path.join(carpetas["estego_pvd"],  nombre_pvd)
		ruta_lsb       = os.path.join(carpetas["estego_lsb"],  nombre_lsb)

		print(f"\n[{i}/{len(imagenes)}] {nombre}")

		try:
			bpcs.preparar_imagen(ruta_original, destino=ruta_preparada)
			print(f"  ✓ Preparada")
		except Exception as e:
			print(f"  ✗ Preparar: {e}")
			errores.append((nombre, "preparar", str(e)))
			continue

		for tag, algo, ruta_out in [
			("BPCS", bpcs, ruta_bpcs),
			("DCT",  dct,  ruta_dct),
			("PVD",  pvd,  ruta_pvd),
			("LSB",  lsb,  ruta_lsb),
		]:
			try:
				capacidad = algo.calcular_capacidad(ruta_preparada)
				# payload = algo.rellenar_payload(args.mensaje, capacidad) if capacidad else args.mensaje
				payload = algo.generar_texto_aleatorio(min_bits=64, max_bits=min(capacidad, 512))
				algo.encode(ruta_preparada, ruta_out, payload)
				print(f"  ✓ {tag}  ({len(algo.texto_a_bits(payload))} bits ocultos)")
			except Exception as e:
				print(f"  ✗ {tag}: {e}")
				errores.append((nombre, tag, str(e)))

	# Resumen
	print("\n" + "=" * 40)
	print("RESUMEN")
	print("=" * 40)
	print(f"Procesadas : {len(imagenes)}")
	print(f"Errores    : {len(errores)}")
	for carpeta_key, label in [
		("originales",  "originales "),
		("estego_bpcs", "estego_bpcs"),
		("estego_dct",  "estego_dct "),
		("estego_pvd",  "estego_pvd "),
		("estego_lsb",  "estego_lsb "),
	]:
		n = len([f for f in os.listdir(carpetas[carpeta_key]) if f.endswith(".png")])
		print(f"  {label}: {n} archivos")

	if errores:
		print("\nDetalle errores:")
		for nombre, etapa, msg in errores:
			print(f"  {nombre} [{etapa}]: {msg}")
	print()


# =====================================
# ENCODE
# =====================================

def cmd_encode(args):
	if not os.path.isfile(args.imagen):
		print(f"Error: no se encontró '{args.imagen}'")
		sys.exit(1)

	salida = args.salida or (
		os.path.splitext(args.imagen)[0] + f"_estego_{args.algoritmo}.png"
	)

	algo = ALGORITMOS[args.algoritmo]()
	capacidad = algo.calcular_capacidad(args.imagen)

	# Decide el mensaje fuente
	if args.aleatorio:
		mensaje = algo.generar_texto_aleatorio(
			min_bits=64,
			max_bits=min(capacidad, 512) if capacidad else 512
		)
	elif args.mensaje:
		mensaje = args.mensaje
	else:
		print("Error: debes proporcionar --mensaje o usar --aleatorio")
		sys.exit(1)

	payload = algo.rellenar_payload(mensaje, capacidad) if capacidad else mensaje

	print(f"\nAlgoritmo : {args.algoritmo.upper()}")
	print(f"Imagen    : {args.imagen}")
	print(f"Salida    : {salida}")
	print(f"Mensaje   : {mensaje}")
	
	if capacidad:
		print(f"Capacidad : {capacidad} bits")
		print(f"Payload   : {len(algo.texto_a_bits(payload))} bits ({payload[:40]}{'...' if len(payload)>40 else ''})\n")

	algo.encode(args.imagen, salida, payload)
	print(f"\nGuardada en: {salida}")

# =====================================
# DECODE
# =====================================

def cmd_decode(args):
	if not os.path.isfile(args.imagen):
		print(f"Error: no se encontró '{args.imagen}'")
		sys.exit(1)

	algo = ALGORITMOS[args.algoritmo]()

	print(f"\nAlgoritmo : {args.algoritmo.upper()}")
	print(f"Imagen    : {args.imagen}\n")

	mensaje = algo.decode(args.imagen)

	mensaje_original = algo.extraer_payload(mensaje)
	print(f"Mensaje recuperado: {mensaje_original}")


# =====================================
# ENTRY POINT
# =====================================

if __name__ == "__main__":

	parser = argparse.ArgumentParser(
		description="Esteganografía con BPCS, DCT y PVD",
		formatter_class=argparse.RawDescriptionHelpFormatter
	)

	sub = parser.add_subparsers(dest="comando")

	# -- dataset --
	p_ds = sub.add_parser("dataset", help="Procesar carpeta completa de imágenes")
	p_ds.add_argument("--carpeta",  required=True,               help="Carpeta con imágenes del dataset")
	p_ds.add_argument("--salida",   default="output",            help="Carpeta de salida (default: output/)")
	p_ds.add_argument("--mensaje",  default=MENSAJE_DEFAULT,     help="Mensaje a ocultar")

	# -- encode --
	p_enc = sub.add_parser("encode", help="Ocultar mensaje en una imagen")
	p_enc.add_argument("--imagen",    required=True,             help="Imagen de entrada")
	p_enc.add_argument("--algoritmo", required=True, choices=ALGORITMOS, help="bpcs | dct | pvd | lsb")
	p_enc.add_argument("--aleatorio", action="store_true", help="Genera un mensaje aleatorio en lugar de usar --mensaje")
	p_enc.add_argument("--mensaje",   default=None,            help="Texto a ocultar")
	p_enc.add_argument("--salida",    default=None,              help="Ruta de salida (opcional)")

	# -- decode --
	p_dec = sub.add_parser("decode", help="Recuperar mensaje de una imagen")
	p_dec.add_argument("--imagen",    required=True,             help="Imagen esteganografiada")
	p_dec.add_argument("--algoritmo", required=True, choices=ALGORITMOS, help="bpcs | dct | pvd")

	args = parser.parse_args()

	if args.comando is None:
		parser.print_help()
		sys.exit(0)

	{"dataset": cmd_dataset, "encode": cmd_encode, "decode": cmd_decode}[args.comando](args)
