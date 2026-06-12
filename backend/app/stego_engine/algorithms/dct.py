import cv2
import numpy as np
from app.stego_engine.algorithms.steganografia_base import SteganografiaBase

class DCT(SteganografiaBase):
	"""
	Esteganografía DCT (Discrete Cosine Transform).
	Oculta un bit por bloque 8×8 comparando dos coeficientes
	de frecuencia media en el canal azul.
	"""

	DELIMITADOR = "1111111111111110" * 2
	MARGEN = 25

	# Posiciones de los coeficientes usados para codificar
	COEF_A = (4, 3)
	COEF_B = (3, 4)

	# =====================================
	# ENCODE
	# =====================================

	def encode(self, imagen_original, imagen_salida, mensaje, **kwargs):
		img, blue = self.leer_canal_azul(self.preparar_imagen(imagen_original), flotante=True)
		bits = self.texto_a_bits(mensaje) + self.DELIMITADOR

		h, w = blue.shape
		capacidad = (h // 8) * (w // 8)

		print(f"Capacidad: {capacidad} bits")
		print(f"Mensaje:   {len(bits)} bits")

		if len(bits) > capacidad:
			raise Exception("La imagen no tiene capacidad suficiente.")

		indice = 0
		ya, xa = self.COEF_A
		yb, xb = self.COEF_B

		for y in range(0, h, 8):
			for x in range(0, w, 8):
				if indice >= len(bits):
						break

				bloque = blue[y:y+8, x:x+8]
				dct = cv2.dct(bloque)
				bit = int(bits[indice])
				c1, c2 = dct[ya, xa], dct[yb, xb]
				mid = (c1 + c2) / 2
				if bit == 1:
					dct[ya, xa] = mid + self.MARGEN
					dct[yb, xb] = mid - self.MARGEN
				else:
					dct[ya, xa] = mid - self.MARGEN
					dct[yb, xb] = mid + self.MARGEN
				blue[y:y+8, x:x+8] = cv2.idct(dct)
				indice += 1

			if indice >= len(bits):
				break

		blue = np.clip(blue, 0, 255)
		self.guardar_canal_azul(img, blue.astype(np.uint8), imagen_salida)
		print("Mensaje ocultado correctamente")

	# =====================================
	# DECODE
	# =====================================

	def decode(self, imagen_estego, **kwargs):
		img, blue = self.leer_canal_azul(imagen_estego, flotante=True)
		h, w = blue.shape
		bits = ""
		ya, xa = self.COEF_A
		yb, xb = self.COEF_B

		encontrado = False

		for y in range(0, h, 8):
			for x in range(0, w, 8):
				bloque = blue[y:y+8, x:x+8]
				dct = cv2.dct(bloque)
				bits += "1" if dct[ya, xa] > dct[yb, xb] else "0"
				if bits.endswith(self.DELIMITADOR):
					encontrado = True
					break
			if encontrado:
				break
		if not encontrado:
			return "No se encontró el mensaje."

		bits = bits[: -len(self.DELIMITADOR)]
		return self.bits_a_texto(bits)

	def calcular_capacidad(self, imagen):
		"""Capacidad DCT: un bit por bloque 8×8."""
		_, blue = self.leer_canal_azul(self.preparar_imagen(imagen))
		h, w = blue.shape
		return (h // 8) * (w // 8) - len(self.DELIMITADOR)