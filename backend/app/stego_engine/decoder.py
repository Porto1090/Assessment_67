from app.stego_engine.algorithms.lsb  import LSB
from app.stego_engine.algorithms.dct  import DCT
from app.stego_engine.algorithms.bpcs import BPCS
from app.stego_engine.algorithms.pvd  import PVD

ALGORITMOS = {
    "lsb":  LSB,
    "dct":  DCT,
    "bpcs": BPCS,
    "pvd":  PVD,
}

class StegoDecoder:
    """
    Gestiona la extracción de mensajes ocultos en imágenes estego
    """
    def apply_extract(self, image_path: str, algorithm: str) -> str:
        """
        Extrae el mensaje oculto de la imagen en 'image_path'
        usando el algoritmo indicado (detectado por el modelo de ML).

        Retorna el mensaje como string.
        Lanza ValueError si el algoritmo no existe.
        """
        key = algorithm.lower()

        if key not in ALGORITMOS:
            raise ValueError(
                f"Algoritmo desconocido: '{algorithm}'. "
                f"Disponibles: {list(ALGORITMOS.keys())}"
            )

        instancia = ALGORITMOS[key]()
        return instancia.decode(imagen_estego=image_path)

decoder = StegoDecoder()
