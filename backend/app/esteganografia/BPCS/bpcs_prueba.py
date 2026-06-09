import cv2
import random
import numpy as np
from PIL import Image

from bpcs_core import *


# =====================================
# PREPARAR IMAGEN
# =====================================

def preparar_imagen(ruta):

    img = Image.open(ruta)

    w, h = img.size

    w = (w // 8) * 8
    h = (h // 8) * 8

    img = img.resize(
        (w, h)
    )

    img.save(
        "imagen_preparada.png",
        "PNG"
    )

    return "imagen_preparada.png"


# =====================================
# BINARIO -> GRAY
# =====================================

def binary_to_gray(img):

    return img ^ (img >> 1)


# =====================================
# GRAY -> BINARIO
# =====================================

def gray_to_binary(gray):

    result = gray.copy()

    result ^= (result >> 1)
    result ^= (result >> 2)
    result ^= (result >> 4)

    return result


# =====================================
# BLOQUES VALIDOS
# =====================================

def obtener_bloques_validos(
        imagen_original,
        clave,
        umbral=0.30):

    ruta = preparar_imagen(
        imagen_original
    )

    img = cv2.imread(
        ruta,
        cv2.IMREAD_COLOR
    )

    blue = img[:, :, 0]

    gray = binary_to_gray(
        blue
    )

    posiciones = []

    planos = [2, 3]

    for plano in planos:

        bitplane = (
            (gray >> plano) & 1
        )

        h, w = bitplane.shape

        for y in range(
                0,
                h,
                8):

            for x in range(
                    0,
                    w,
                    8):

                bloque = bitplane[
                    y:y+8,
                    x:x+8
                ]

                if bloque.shape != (
                        8,
                        8):
                    continue

                c = complejidad_bloque(
                    bloque
                )

                if c > umbral:

                    posiciones.append(
                        (
                            plano,
                            y,
                            x
                        )
                    )

    rng = random.Random(
        clave
    )

    rng.shuffle(
        posiciones
    )

    return posiciones


# =====================================
# ENCODE
# =====================================

def encode_bpcs(
        imagen_original,
        imagen_salida,
        mensaje,
        clave):

    ruta = preparar_imagen(
        imagen_original
    )

    img = cv2.imread(
        ruta,
        cv2.IMREAD_COLOR
    )

    blue = img[:, :, 0]

    gray = binary_to_gray(
        blue
    )

    bloques_mensaje, mapa, longitud = (
        crear_bloques(
            mensaje
        )
    )

    stream = crear_stream(
        bloques_mensaje,
        mapa,
        longitud
    )

    posiciones = (
        obtener_bloques_validos(
            imagen_original,
            clave
        )
    )

    indice = 0

    bloques_usados = 0

    for plano, y, x in posiciones:

        if indice >= len(stream):
            break

        bitplane = (
            (gray >> plano) & 1
        ).copy()

        nuevos_bits = []

        for _ in range(64):

            if indice < len(stream):

                nuevos_bits.append(
                    int(stream[indice])
                )

                indice += 1

            else:

                nuevos_bits.append(0)

        bloque_nuevo = np.array(
            nuevos_bits,
            dtype=np.uint8
        ).reshape(
            8,
            8
        )

        bitplane[
            y:y+8,
            x:x+8
        ] = bloque_nuevo

        mascara = (
            ~(1 << plano)
        ) & 255

        gray = (
            gray & mascara
        ) | (
            bitplane << plano
        )

        bloques_usados += 1

    blue_estego = (
        gray_to_binary(
            gray
        )
    )

    img[:, :, 0] = (
        blue_estego
    )

    cv2.imwrite(
        imagen_salida,
        img
    )

    print(
        "\n===== ENCODE =====\n"
    )

    print(
        "Bits stream:",
        len(stream)
    )

    print(
        "Bloques usados:",
        bloques_usados
    )

    print(
        "Mensaje ocultado"
    )


# =====================================
# DECODE
# =====================================

def decode_bpcs(
        imagen_original,
        imagen_estego,
        clave):

    img = cv2.imread(
        imagen_estego,
        cv2.IMREAD_COLOR
    )

    blue = img[:, :, 0]

    gray = binary_to_gray(
        blue
    )

    posiciones = (
        obtener_bloques_validos(
            imagen_original,
            clave
        )
    )

    bits = ""

    for plano, y, x in posiciones:

        bitplane = (
            (gray >> plano) & 1
        )

        bloque = bitplane[
            y:y+8,
            x:x+8
        ]

        bits += ''.join(
            str(int(v))
            for v in bloque.flatten()
        )

        if len(bits) >= 32:

            total = longitud_stream(
                bits
            )

            if len(bits) >= (
                    32 + total
            ):
                break

    total = longitud_stream(
        bits
    )

    stream_real = bits[
        :32 + total
    ]

    longitud, mapa, bloques = (
        leer_stream(
            stream_real
        )
    )

    mensaje = (
        reconstruir_mensaje(
            bloques,
            mapa,
            longitud
        )
    )

    return mensaje


# =====================================
# PRUEBA
# =====================================

clave = "Porto777"

mensaje = (
    "Cartero 67"
)

encode_bpcs(
    "tu_imagen.webp",
    "imagen_estego_bpcs_v4.png",
    mensaje,
    clave
)

texto = decode_bpcs(
    "tu_imagen.webp",
    "imagen_estego_bpcs_v4.png",
    clave
)

print(
    "\n===== DECODE =====\n"
)

print(
    "Mensaje recuperado:"
)

print(
    texto
)

print(
    "\nCorrecto:",
    texto == mensaje
)
