import os

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

class StegoEncoder:
    """
    Gestiona el ocultamiento de mensajes en imágenes
    """
    def __init__(self, output_dir: str = "temp_evidence"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def apply_hide(self, image_path: str, message: str, algorithm: str) -> str:
        """
        Oculta 'message' en la imagen ubicada en 'image_path'
        usando el algoritmo indicado.

        Retorna la ruta de la imagen de salida (estego).
        Lanza ValueError si el algoritmo no existe.
        """
        key = algorithm.lower()

        if key not in ALGORITMOS:
            raise ValueError(
                f"Algoritmo desconocido: '{algorithm}'. "
                f"Disponibles: {list(ALGORITMOS.keys())}"
            )

        filename    = os.path.basename(image_path)
        base, _     = os.path.splitext(filename)
        output_path = os.path.join(self.output_dir, f"{base}_stego_{key}.png")

        ALGORITMOS[key]().encode(
            imagen_original=image_path,
            imagen_salida=output_path,
            mensaje=message,
        )
        return output_path

encoder = StegoEncoder()
