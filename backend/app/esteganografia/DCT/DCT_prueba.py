import cv2
import numpy as np
from PIL import Image


# =====================================
# PREPARAR IMAGEN
# =====================================

def preparar_imagen(ruta_entrada):

    img = Image.open(ruta_entrada)

    w, h = img.size

    w = (w // 8) * 8
    h = (h // 8) * 8

    img = img.resize((w, h))

    ruta_png = "imagen_preparada.png"

    img.save(ruta_png, "PNG")

    return ruta_png


# =====================================
# TEXTO -> BITS
# =====================================

def texto_a_bits(texto):

    datos = texto.encode("utf-8")

    bits = ''.join(
        format(byte, '08b')
        for byte in datos
    )

    # Delimitador
    bits += "11111111111111101111111111111110"

    return bits


# =====================================
# BITS -> TEXTO
# =====================================

def bits_a_texto(bits):

    datos = bytearray()

    for i in range(0, len(bits), 8):

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
# OCULTAR MENSAJE
# =====================================

def ocultar_dct(
        imagen_original,
        imagen_salida,
        mensaje):

    ruta_png = preparar_imagen(
        imagen_original
    )

    img = cv2.imread(
        ruta_png,
        cv2.IMREAD_COLOR
    )

    blue = img[:, :, 0].astype(
        np.float32
    )

    bits = texto_a_bits(
        mensaje
    )

    h, w = blue.shape

    capacidad = (
        h // 8
    ) * (
        w // 8
    )

    print(
        f"Capacidad: {capacidad} bits"
    )

    print(
        f"Mensaje: {len(bits)} bits"
    )

    if len(bits) > capacidad:

        raise Exception(
            "La imagen no tiene "
            "capacidad suficiente."
        )

    indice = 0

    for y in range(0, h, 8):

        for x in range(0, w, 8):

            if indice >= len(bits):
                break

            bloque = blue[
                y:y+8,
                x:x+8
            ]

            dct = cv2.dct(
                bloque
            )

            bit = int(
                bits[indice]
            )

            margen = 25

            c1 = dct[4, 3]
            c2 = dct[3, 4]

            if bit == 1:

                if c1 <= c2:

                    dct[4, 3] = (
                        c2 + margen
                    )

            else:

                if c1 >= c2:

                    dct[3, 4] = (
                        c1 + margen
                    )

            blue[
                y:y+8,
                x:x+8
            ] = cv2.idct(
                dct
            )

            indice += 1

        if indice >= len(bits):
            break

    blue = np.clip(
        blue,
        0,
        255
    )

    img[:, :, 0] = blue.astype(
        np.uint8
    )

    cv2.imwrite(
        imagen_salida,
        img
    )

    print(
        "Mensaje ocultado correctamente"
    )


# =====================================
# RECUPERAR MENSAJE
# =====================================

def recuperar_dct(imagen):

    img = cv2.imread(
        imagen,
        cv2.IMREAD_COLOR
    )

    blue = img[:, :, 0].astype(
        np.float32
    )

    h, w = blue.shape

    bits = ""

    delimitador = (
        "1111111111111110"
        "1111111111111110"
    )

    encontrado = False

    for y in range(0, h, 8):

        for x in range(0, w, 8):

            bloque = blue[
                y:y+8,
                x:x+8
            ]

            dct = cv2.dct(
                bloque
            )

            c1 = dct[4, 3]
            c2 = dct[3, 4]

            if c1 > c2:
                bits += "1"
            else:
                bits += "0"

            if bits.endswith(
                delimitador
            ):
                encontrado = True
                break

        if encontrado:
            break

    if not encontrado:

        return (
            "No se encontró "
            "el mensaje."
        )

    bits = bits[
        :-len(delimitador)
    ]

    return bits_a_texto(
        bits
    )


# =====================================
# PRUEBA
# =====================================

mensaje = "Mauri baboso"

ocultar_dct(
    "tu_imagen.webp",
    "imagen_estego.png",
    mensaje
)

texto = recuperar_dct(
    "imagen_estego.png"
)

print(
    "\nMensaje recuperado:"
)

print(texto)
