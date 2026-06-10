from steganografia_base import SteganografiaBase


class PVD(SteganografiaBase):
    """
    Esteganografía PVD (Pixel Value Differencing).
    Oculta bits en parejas de píxeles adyacentes del canal azul
    aprovechando la diferencia de valor entre ellos.
    """

    # Tabla de rangos: (límite_superior_inclusivo, bits_a_ocultar)
    _RANGOS = [
        (7,   1),
        (15,  2),
        (31,  3),
        (63,  4),
        (127, 5),
        (255, 6),
    ]

    # =====================================
    # TABLA DE RANGOS
    # =====================================

    @classmethod
    def _info_rango(cls, d):
        """Devuelve (límite_inferior, límite_superior, n_bits) para la diferencia d."""

        limite_inf = 0

        for limite_sup, n_bits in cls._RANGOS:

            if d <= limite_sup:
                return limite_inf, limite_sup, n_bits

            limite_inf = limite_sup + 1

        # Por si d > 255 (no debería ocurrir)
        return 128, 255, 6

    # =====================================
    # PARES PSEUDOALEATORIOS
    # =====================================

    def _generar_pares(self, ancho, alto):

        return [
            (y, x)
            for y in range(alto)
            for x in range(0, ancho - 1, 2)
        ]

    # =====================================
    # INSERTAR / EXTRAER BITS EN UN PAR
    # =====================================

    @classmethod
    def _insertar_bits(cls, p1, p2, bits):

        d = abs(int(p2) - int(p1))

        l, _, _ = cls._info_rango(d)

        nueva_d = l + int(bits, 2)

        m = nueva_d - d

        if p2 >= p1:
            p1_nuevo = int(p1) - (m // 2)
            p2_nuevo = int(p2) + (m - m // 2)
        else:
            p1_nuevo = int(p1) + (m // 2)
            p2_nuevo = int(p2) - (m - m // 2)

        return (
            max(0, min(255, p1_nuevo)),
            max(0, min(255, p2_nuevo)),
        )

    @classmethod
    def _extraer_bits(cls, p1, p2):

        d = abs(int(p2) - int(p1))

        l, _, n_bits = cls._info_rango(d)

        return format(d - l, f'0{n_bits}b')

    # =====================================
    # ENCODE
    # =====================================

    def encode(self, imagen_original, imagen_salida, mensaje, **kwargs):

        ruta = self.preparar_imagen(imagen_original, multiplo=2)

        img, blue = self.leer_canal_azul(ruta)

        stream = self.crear_stream_simple(mensaje)

        h, w = blue.shape

        pares = self._generar_pares(w, h)

        # Capacidad total
        capacidad = sum(
            self._info_rango(abs(int(blue[y, x + 1]) - int(blue[y, x])))[2]
            for y, x in pares
        )

        print("\n===== CAPACIDAD PVD =====\n")
        print("Bits: ", capacidad)
        print("Bytes:", capacidad // 8)
        print("KB:   ", round(capacidad / 8 / 1024, 2))

        if len(stream) > capacidad:
            raise ValueError("Mensaje demasiado grande para esta imagen.")

        indice = pares_usados = 0

        for y, x in pares:

            if indice >= len(stream):
                break

            p1, p2 = blue[y, x], blue[y, x + 1]

            d     = abs(int(p2) - int(p1))
            _, _, n_bits = self._info_rango(d)

            chunk = stream[indice: indice + n_bits]

            if len(chunk) < n_bits:
                chunk += "0" * (n_bits - len(chunk))

            blue[y, x], blue[y, x + 1] = self._insertar_bits(p1, p2, chunk)

            indice     += n_bits
            pares_usados += 1

        self.guardar_canal_azul(img, blue, imagen_salida)

        print("\n===== ENCODE PVD =====\n")
        print("Bits stream:  ", len(stream))
        print("Pares usados:", pares_usados)
        print("Mensaje ocultado")

    # =====================================
    # DECODE
    # =====================================

    def decode(self, imagen_estego, **kwargs):

        img, blue = self.leer_canal_azul(imagen_estego)

        h, w = blue.shape

        pares = self._generar_pares(w, h)

        bits    = ""
        longitud = None

        for y, x in pares:

            bits += self._extraer_bits(blue[y, x], blue[y, x + 1])

            if longitud is None and len(bits) >= 32:
                longitud = int(bits[:32], 2)

            if longitud is not None and len(bits) >= 32 + longitud:
                return self.leer_stream_simple(bits)

        return ""

    def calcular_capacidad(self, imagen):
        """Capacidad PVD: suma de bits disponibles por cada par de píxeles."""
        ruta = self.preparar_imagen(imagen, multiplo=2)
        _, blue = self.leer_canal_azul(ruta)
        h, w = blue.shape
        pares = self._generar_pares(w, h)
        capacidad = sum(
            self._info_rango(abs(int(blue[y, x+1]) - int(blue[y, x])))[2]
            for y, x in pares
        )
        # Restar los 32 bits del header del stream
        return capacidad - 32
