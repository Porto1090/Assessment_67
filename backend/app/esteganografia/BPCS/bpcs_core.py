import numpy as np


# =====================================
# TEXTO -> BITS
# =====================================

def texto_a_bits(texto):

    return ''.join(
        format(b, '08b')
        for b in texto.encode(
            "utf-8"
        )
    )


# =====================================
# BITS -> TEXTO
# =====================================

def bits_a_texto(bits):

    datos = bytearray()

    for i in range(
        0,
        len(bits),
        8
    ):

        byte = bits[i:i+8]

        if len(byte) < 8:
            break

        datos.append(
            int(byte, 2)
        )

    return datos.decode(
        "utf-8",
        errors="ignore"
    )


# =====================================
# COMPLEJIDAD BPCS
# =====================================

def complejidad_bloque(bloque):

    transiciones = 0

    # horizontales
    for y in range(8):

        for x in range(7):

            if bloque[y, x] != bloque[y, x + 1]:

                transiciones += 1

    # verticales
    for y in range(7):

        for x in range(8):

            if bloque[y, x] != bloque[y + 1, x]:

                transiciones += 1

    return transiciones / 112


# =====================================
# PATRON DE CONJUGACION
# =====================================

def patron_conjugacion():

    patron = np.zeros(
        (8, 8),
        dtype=np.uint8
    )

    for y in range(8):

        for x in range(8):

            patron[y, x] = (
                x + y
            ) % 2

    return patron


# =====================================
# CONJUGAR / DESCONJUGAR
# =====================================

def conjugate_block(block):

    return np.bitwise_xor(
        block,
        patron_conjugacion()
    )


# =====================================
# MENSAJE -> BLOQUES
# =====================================

def crear_bloques(
        mensaje,
        alpha=0.30):

    bits = texto_a_bits(
        mensaje
    )

    longitud_original = len(
        bits
    )

    bloques = []

    mapa = []

    indice = 0

    while indice < len(bits):

        chunk = bits[
            indice:
            indice + 64
        ]

        if len(chunk) < 64:

            chunk += (
                "0" *
                (64 - len(chunk))
            )

        bloque = np.array(
            [
                int(x)
                for x in chunk
            ],
            dtype=np.uint8
        ).reshape(8, 8)

        complejidad = (
            complejidad_bloque(
                bloque
            )
        )

        if complejidad < alpha:

            bloque = (
                conjugate_block(
                    bloque
                )
            )

            mapa.append(1)

        else:

            mapa.append(0)

        bloques.append(
            bloque
        )

        indice += 64

    return (
        bloques,
        mapa,
        longitud_original
    )


# =====================================
# BLOQUES -> STREAM
# =====================================

def crear_stream(
        bloques,
        mapa,
        longitud):

    longitud_mensaje_bits = format(
        longitud,
        '032b'
    )

    cantidad_bloques_bits = format(
        len(bloques),
        '032b'
    )

    mapa_bits = ''.join(
        str(x)
        for x in mapa
    )

    datos_bits = ""

    for bloque in bloques:

        datos_bits += ''.join(
            str(int(x))
            for x in bloque.flatten()
        )

    contenido = (
        longitud_mensaje_bits +
        cantidad_bloques_bits +
        mapa_bits +
        datos_bits
    )

    longitud_total_bits = format(
        len(contenido),
        '032b'
    )

    return (
        longitud_total_bits +
        contenido
    )


# =====================================
# OBTENER LONGITUD TOTAL
# =====================================

def longitud_stream(stream):

    return int(
        stream[:32],
        2
    )


# =====================================
# STREAM -> ESTRUCTURA
# =====================================

def leer_stream(stream):

    longitud_total = int(
        stream[:32],
        2
    )

    contenido = stream[
        32:
        32 + longitud_total
    ]

    longitud = int(
        contenido[:32],
        2
    )

    cantidad = int(
        contenido[32:64],
        2
    )

    inicio_mapa = 64

    fin_mapa = (
        inicio_mapa +
        cantidad
    )

    mapa = [
        int(x)
        for x in contenido[
            inicio_mapa:
            fin_mapa
        ]
    ]

    datos = contenido[
        fin_mapa:
    ]

    bloques = []

    indice = 0

    for _ in range(cantidad):

        chunk = datos[
            indice:
            indice + 64
        ]

        bloque = np.array(
            [
                int(x)
                for x in chunk
            ],
            dtype=np.uint8
        ).reshape(8, 8)

        bloques.append(
            bloque
        )

        indice += 64

    return (
        longitud,
        mapa,
        bloques
    )


# =====================================
# BLOQUES -> MENSAJE
# =====================================

def reconstruir_mensaje(
        bloques,
        mapa,
        longitud):

    bits = ""

    for bloque, flag in zip(
            bloques,
            mapa):

        if flag == 1:

            bloque = (
                conjugate_block(
                    bloque
                )
            )

        bits += ''.join(
            str(int(x))
            for x in bloque.flatten()
        )

    bits = bits[
        :longitud
    ]

    return bits_a_texto(
        bits
    )
