import numpy as np

from steganografia_base import SteganografiaBase


class BPCS(SteganografiaBase):
    """
    Esteganografía BPCS (Bit-Plane Complexity Segmentation).

    NOTA: el decode requiere la imagen original porque escribir el
    stream puede reducir la complejidad de algunos bloques, haciendo
    que las posiciones calculadas desde la esteganografiada difieran
    de las usadas en el encode.
    """

    UMBRAL_DEFAULT = 0.30

    @staticmethod
    def _binary_to_gray(img):
        return img ^ (img >> 1)

    @staticmethod
    def _gray_to_binary(gray):
        result = gray.copy()
        result ^= (result >> 1)
        result ^= (result >> 2)
        result ^= (result >> 4)
        return result

    @staticmethod
    def _complejidad_bloque(bloque):
        transiciones = 0
        for y in range(8):
            for x in range(7):
                if bloque[y, x] != bloque[y, x + 1]:
                    transiciones += 1
        for y in range(7):
            for x in range(8):
                if bloque[y, x] != bloque[y + 1, x]:
                    transiciones += 1
        return transiciones / 112

    @staticmethod
    def _patron_conjugacion():
        patron = np.zeros((8, 8), dtype=np.uint8)
        for y in range(8):
            for x in range(8):
                patron[y, x] = (x + y) % 2
        return patron

    @classmethod
    def _conjugar_bloque(cls, bloque):
        return np.bitwise_xor(bloque, cls._patron_conjugacion())

    def _crear_bloques_mensaje(self, mensaje, alpha=None):
        alpha = alpha or self.UMBRAL_DEFAULT
        bits  = self.texto_a_bits(mensaje)
        longitud_original = len(bits)
        bloques, mapa, indice = [], [], 0
        while indice < len(bits):
            chunk = bits[indice: indice + 64]
            if len(chunk) < 64:
                chunk += "0" * (64 - len(chunk))
            bloque = np.array([int(x) for x in chunk], dtype=np.uint8).reshape(8, 8)
            if self._complejidad_bloque(bloque) < alpha:
                bloque = self._conjugar_bloque(bloque)
                mapa.append(1)
            else:
                mapa.append(0)
            bloques.append(bloque)
            indice += 64
        return bloques, mapa, longitud_original

    def _crear_stream_bpcs(self, bloques, mapa, longitud):
        longitud_msg = format(longitud,     '032b')
        cantidad     = format(len(bloques), '032b')
        mapa_bits    = ''.join(str(x) for x in mapa)
        datos_bits   = ''.join(str(int(x)) for bloque in bloques for x in bloque.flatten())
        contenido    = longitud_msg + cantidad + mapa_bits + datos_bits
        return format(len(contenido), '032b') + contenido

    @staticmethod
    def _longitud_stream_bpcs(stream):
        return int(stream[:32], 2)

    def _leer_stream_bpcs(self, stream):
        longitud_total = int(stream[:32], 2)
        contenido = stream[32: 32 + longitud_total]
        longitud  = int(contenido[:32], 2)
        cantidad  = int(contenido[32:64], 2)
        fin_mapa  = 64 + cantidad
        mapa      = [int(x) for x in contenido[64:fin_mapa]]
        datos     = contenido[fin_mapa:]
        bloques   = []
        for i in range(cantidad):
            chunk  = datos[i*64: i*64 + 64]
            bloque = np.array([int(x) for x in chunk], dtype=np.uint8).reshape(8, 8)
            bloques.append(bloque)
        return longitud, mapa, bloques

    def _reconstruir_mensaje(self, bloques, mapa, longitud):
        bits = ""
        for bloque, flag in zip(bloques, mapa):
            if flag == 1:
                bloque = self._conjugar_bloque(bloque)
            bits += ''.join(str(int(x)) for x in bloque.flatten())
        return self.bits_a_texto(bits[:longitud])

    def _obtener_posiciones_validas(self, imagen, umbral=None, planos=(2, 3)):
        umbral = umbral or self.UMBRAL_DEFAULT
        ruta   = self.preparar_imagen(imagen)
        img, blue = self.leer_canal_azul(ruta)
        gray   = self._binary_to_gray(blue)
        posiciones = []
        for plano in planos:
            bitplane = (gray >> plano) & 1
            h, w = bitplane.shape
            for y in range(0, h, 8):
                for x in range(0, w, 8):
                    bloque = bitplane[y:y+8, x:x+8]
                    if bloque.shape != (8, 8):
                        continue
                    if self._complejidad_bloque(bloque) > umbral:
                        posiciones.append((plano, y, x))
        return posiciones

    def calcular_capacidad(self, imagen):
        """
        Capacidad neta en bits de mensaje disponibles.
        Descuenta el overhead del stream (64 bits de header + 1 bit de mapa por bloque).
        stream_total = 32 + 32 + 32 + N_bloques + N_bloques*64 = 96 + N_bloques*65
        Despejando: N_bloques = (M*64 - 96) // 65
        """
        M = len(self._obtener_posiciones_validas(imagen))
        N_bloques = (M * 64 - 96) // 65
        return N_bloques * 64

    # =====================================
    # ENCODE
    # =====================================

    def encode(self, imagen_original, imagen_salida, mensaje, **kwargs):
        ruta = self.preparar_imagen(imagen_original)
        img, blue = self.leer_canal_azul(ruta)
        gray = self._binary_to_gray(blue)

        bloques, mapa, longitud = self._crear_bloques_mensaje(mensaje)
        stream     = self._crear_stream_bpcs(bloques, mapa, longitud)
        posiciones = self._obtener_posiciones_validas(imagen_original)

        indice = bloques_usados = 0
        for plano, y, x in posiciones:
            if indice >= len(stream):
                break
            bitplane = ((gray >> plano) & 1).copy()
            nuevos_bits = [
                int(stream[indice + k]) if indice + k < len(stream) else 0
                for k in range(64)
            ]
            indice += 64
            bloque_nuevo = np.array(nuevos_bits, dtype=np.uint8).reshape(8, 8)
            bitplane[y:y+8, x:x+8] = bloque_nuevo
            mascara = (~(1 << plano)) & 255
            gray    = (gray & mascara) | (bitplane << plano)
            bloques_usados += 1

        blue_estego = self._gray_to_binary(gray)
        self.guardar_canal_azul(img, blue_estego, imagen_salida)

        print("\n===== ENCODE BPCS =====\n")
        print("Bits stream:   ", len(stream))
        print("Bloques usados:", bloques_usados)
        print("Mensaje ocultado")

    # =====================================
    # DECODE
    # Requiere la imagen original para calcular las mismas
    # posiciones que se usaron en el encode.
    # =====================================

    def decode(self, imagen_estego, imagen_original=None, **kwargs):
        if not imagen_original:
            raise ValueError(
                "BPCS necesita la imagen original para decodear.\n"
                "Usa: decode(imagen_estego, imagen_original='ruta/original.png')"
            )

        img, blue = self.leer_canal_azul(imagen_estego)
        gray = self._binary_to_gray(blue)
        posiciones = self._obtener_posiciones_validas(imagen_original)

        bits  = ""
        total = None
        for plano, y, x in posiciones:
            bitplane = (gray >> plano) & 1
            bloque   = bitplane[y:y+8, x:x+8]
            bits += ''.join(str(int(v)) for v in bloque.flatten())
            if total is None and len(bits) >= 32:
                total = self._longitud_stream_bpcs(bits)
            if total is not None and len(bits) >= 32 + total:
                break

        stream_real = bits[: 32 + total]
        longitud, mapa, bloques = self._leer_stream_bpcs(stream_real)
        return self._reconstruir_mensaje(bloques, mapa, longitud)
