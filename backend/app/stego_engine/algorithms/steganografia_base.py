import cv2
import numpy as np
from abc import ABC, abstractmethod
from PIL import Image
import random
import string

class SteganografiaBase(ABC):
	"""
	Clase base para algoritmos de esteganografía.
	Provee utilidades compartidas: conversión bits/texto,
	preparación de imagen y stream de datos.
	"""

	# Tamaño al que se redimensionan todas las imágenes.
	SIZE = (256, 256)

	# =====================================
	# TEXTO -> BITS
	# =====================================

	@staticmethod
	def texto_a_bits(texto):
		return ''.join(format(b, '08b') for b in texto.encode("utf-8"))

	# =====================================
	# BITS -> TEXTO
	# =====================================

	@staticmethod
	def bits_a_texto(bits):
		datos = bytearray()
		for i in range(0, len(bits), 8):
			byte = bits[i:i+8]
			if len(byte) < 8:
				break
			datos.append(int(byte, 2))
		return datos.decode("utf-8", errors="ignore")

	# Vocabulario mixto español/inglés
	_VOCABULARIO = [
		"the", "hello", "world", "secret", "data", "image", "pixel", "hidden",
		"noise", "random", "cipher", "encode", "decode", "neural", "network",
		"hola", "mundo", "secreto", "imagen", "oculto", "datos", "ruido",
		"cifrado", "red", "neuronal", "entrenamiento", "modelo", "algoritmo",
		"python", "matrix", "signal", "layer", "feature", "vision", "deep",
		"bits", "byte", "flag", "token", "vector", "canal", "plano", "bloque",
	]

	@staticmethod
	def generar_texto_aleatorio(min_bits: int = 64, max_bits: int = 512) -> str:
		"""
		Genera un texto secreto aleatorio mezclando palabras reales
		(español/inglés) con segmentos alfanuméricos de ruido.

		El texto resultante tiene una longitud en bits (UTF-8) dentro
		del rango [min_bits, max_bits].
		"""
		objetivo_bits = random.randint(min_bits, max_bits)
		partes = []
		bits_acumulados = 0

		while bits_acumulados < objetivo_bits:
			# Decide aleatoriamente: palabra real o ruido
			if random.random() < 0.6:
				segmento = random.choice(SteganografiaBase._VOCABULARIO)
			else:
				longitud = random.randint(3, 10)
				chars = string.ascii_letters + string.digits
				segmento = ''.join(random.choices(chars, k=longitud))

			# Agrega separador si ya hay contenido
			candidato = (" " + segmento) if partes else segmento
			bits_candidato = len(candidato.encode("utf-8")) * 8

			# Si agregar este segmento se pasa del límite, para
			if bits_acumulados + bits_candidato > objetivo_bits:
				break

			partes.append(candidato)
			bits_acumulados += bits_candidato

		return ''.join(partes)

	# =====================================
	# PREPARAR IMAGEN
	# =====================================

	def preparar_imagen(self, ruta, destino=None):
		"""
		Abre cualquier formato, redimensiona a SIZE y devuelve
		un array BGR listo para OpenCV.
		Si se indica destino guarda también una copia PNG en esa ruta.
		"""
		img = Image.open(ruta).convert("RGB")
		img = img.resize(self.SIZE, Image.NEAREST)
		if destino:
			img.save(destino, "PNG")
		return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

	# =====================================
	# CANAL AZUL
	# =====================================

	def leer_canal_azul(self, origen, flotante=False):
		img = origen if isinstance(origen, np.ndarray) else cv2.imread(origen, cv2.IMREAD_COLOR)
		blue = img[:, :, 0].astype(np.float32) if flotante else img[:, :, 0]
		return img.copy(), blue

	def guardar_canal_azul(self, img, blue, ruta_salida):
		img[:, :, 0] = blue
		cv2.imwrite(ruta_salida, img)

	# =====================================
	# STREAM GENÉRICO
	# =====================================

	def crear_stream_simple(self, mensaje):
		bits = self.texto_a_bits(mensaje)
		return format(len(bits), '032b') + bits

	def leer_stream_simple(self, stream):
		longitud = int(stream[:32], 2)
		return self.bits_a_texto(stream[32: 32 + longitud])

	# =====================================
	# INTERFAZ PÚBLICA
	# =====================================

	@abstractmethod
	def encode(self, imagen_original, imagen_salida, mensaje, **kwargs):
		"""Oculta el mensaje en la imagen y la guarda en imagen_salida."""

	@abstractmethod
	def decode(self, imagen_estego, **kwargs):
		"""Recupera y devuelve el mensaje oculto en imagen_estego."""

	# =====================================
	# PAYLOAD — relleno de capacidad
	# =====================================

	SEPARADOR = "%"

	def rellenar_payload(self, mensaje, capacidad_bits):
		"""
		Repite el mensaje separado por SEPARADOR hasta ocupar
		casi toda la capacidad disponible.
		"""
		unidad          = mensaje + self.SEPARADOR
		bits_por_unidad = len(self.texto_a_bits(unidad))
		repeticiones    = capacidad_bits // bits_por_unidad

		if repeticiones == 0:
			return mensaje

		return unidad * repeticiones

	@staticmethod
	def extraer_payload(payload):
		"""
		Extrae el mensaje original de un payload rellenado.
		"porto%porto%porto%" → "porto"
		"""
		partes = [p for p in payload.split("%") if p]
		return partes[0] if partes else payload

	def calcular_capacidad(self, imagen):
		"""
		Devuelve la capacidad en bits disponibles para ocultar datos.
		Cada subclase lo implementa según su algoritmo.
		"""
		return None