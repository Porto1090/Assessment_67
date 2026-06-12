from app.stego_engine.algorithms.steganografia_base import SteganografiaBase

class LSB(SteganografiaBase):
	"""
	Least Significant Bit (LSB)

	Oculta información en el bit menos significativo
	del canal azul.

	Capacidad:
		1 bit por pixel.

	Ventajas:
		- Muy simple
		- Muy rápida
		- No requiere imagen original para decodear

	Desventajas:
		- Poco robusta frente a compresión o modificaciones
	"""

	# =====================================
	# CAPACIDAD
	# =====================================

	def calcular_capacidad(self, imagen):
		ruta = self.preparar_imagen(imagen)
		img, blue = self.leer_canal_azul(ruta)
		h, w = blue.shape
		capacidad_total = h * w

		# 32 bits reservados para longitud
		return max(0, capacidad_total - 32)

	# =====================================
	# ENCODE
	# =====================================

	def encode(
		self,
		imagen_original,
		imagen_salida,
		mensaje,
		**kwargs
	):
		ruta = self.preparar_imagen(imagen_original)
		img, blue = self.leer_canal_azul(ruta)

		stream = self.crear_stream_simple(mensaje)

		h, w = blue.shape
		capacidad = h * w

		if len(stream) > capacidad:
			raise ValueError(
				f"Mensaje demasiado grande.\n"
				f"Necesita {len(stream)} bits\n"
				f"Capacidad disponible {capacidad} bits"
			)

		indice = 0

		for y in range(h):
			for x in range(w):

				if indice >= len(stream):
					break

				bit = int(stream[indice])

				blue[y, x] = (
					blue[y, x] & 0b11111110
				) | bit

				indice += 1

			if indice >= len(stream):
				break

		self.guardar_canal_azul(
			img,
			blue,
			imagen_salida
		)

		print("\n===== ENCODE LSB =====\n")
		print("Bits stream:   ", len(stream))
		print("Pixels usados: ", indice)
		print("Mensaje ocultado")

	# =====================================
	# DECODE
	# =====================================

	def decode(
		self,
		imagen_estego,
		**kwargs
	):
		img, blue = self.leer_canal_azul(imagen_estego)

		h, w = blue.shape

		bits = []

		for y in range(h):
			for x in range(w):
				bits.append(
					str(blue[y, x] & 1)
				)

		stream = ''.join(bits)

		return self.leer_stream_simple(stream)