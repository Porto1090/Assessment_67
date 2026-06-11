# STEGANOGRAPHY

## Investigación de Algoritmos de Esteganografía

## Objetivo

Investigar e implementar diferentes algoritmos de esteganografía para ocultar información dentro de imágenes digitales, evaluando su funcionamiento y viabilidad para integrarlos en el proyecto de entrenamiento de modelos de detección.

---

## Estructura del proyecto

```
esteganografia/
├── steganografia_base.py   # Clase base abstracta compartida
├── bpcs.py                 # Algoritmo BPCS
├── dct.py                  # Algoritmo DCT
├── pvd.py                  # Algoritmo PVD
└── main.py                 # CLI unificado
```

---

## Algoritmos implementados

### DCT (Discrete Cosine Transform)

Técnica de esteganografía en el dominio de la frecuencia. Transforma bloques 8×8 del canal azul mediante la Transformada Discreta del Coseno y modifica dos coeficientes de frecuencia media para codificar cada bit.

#### Características

- Ocultamiento en el dominio de la frecuencia.
- 1 bit oculto por bloque 8×8.
- Usa margen absoluto sobre el punto medio de los coeficientes para garantizar robustez ante distintos tipos de imagen.
- Delimitador de fin de mensaje embebido en el stream.

#### Estado

- Investigación completada.
- Prototipo funcional implementado.
- Inserción y recuperación de mensajes validadas.

---

### BPCS (Bit Plane Complexity Segmentation)

Técnica que aprovecha los planos de bits complejos de una imagen para ocultar información. Solo los bloques con alta complejidad visual son usados, minimizando el impacto perceptible.

#### Características

- Conversión a código Gray antes de operar sobre los planos de bit.
- Análisis de complejidad de bloques 8×8 (umbral 0.30).
- Conjugación automática para bloques con baja complejidad, con mapa de conjugación para recuperación correcta.
- Planos de bit 2 y 3 del canal azul.
- **Requiere la imagen original para decodear**, ya que escribir el stream puede reducir la complejidad de algunos bloques, alterando las posiciones disponibles en la imagen esteganografiada.

#### Estado

- Investigación completada.
- Prototipo funcional implementado.
- Inserción y recuperación de mensajes validadas.

---

### PVD (Pixel Value Differencing)

Técnica basada en las diferencias entre píxeles vecinos para determinar la cantidad de información que puede ocultarse en cada par.

#### Características

- Opera sobre pares de píxeles adyacentes del canal azul.
- Tabla de rangos de 6 niveles: a mayor diferencia entre píxeles, más bits se pueden ocultar (1–6 bits por par).
- Ajuste proporcional de ambos píxeles del par para mantener coherencia visual.
- No requiere imagen original para decodear.

#### Estado

- Investigación completada.
- Prototipo funcional implementado.
- Inserción y recuperación de mensajes validadas.

---

## Arquitectura

Los tres algoritmos heredan de `SteganografiaBase`, que provee:

- Conversión texto ↔ bits (UTF-8).
- Preparación de imagen (cualquier formato → array BGR en memoria, múltiplo de 8).
- Lectura y escritura del canal azul.
- Stream genérico con header de longitud.
- Payload fill: rellena automáticamente la capacidad disponible repitiendo el mensaje, y lo extrae correctamente al decodear.

---

## Uso

### To process a full directory (All decoders)

```sh
python main.py dataset --carpeta {INPUT_ROUTE} --salida {OUTPUT_ROUTE} --mensaje {MESSAGE}
```

#### Examples

```sh
python main.py dataset --carpeta images/

python main.py dataset --carpeta images/ --salida results/ --mensaje "Hello World!"
```

### To Ecode only one image

```sh
python main.py encode --imagen {INPUT_ROUTE/FILE_NAME} --algoritmo {ALGORITHM_NAME} --mensaje {MESSAGE} --salida {OUTPUT_ROUTE/OUTPUT_FILE_NAME}
```

#### Examples

```sh
python main.py encode --imagen image1.png --algoritmo lsb --mensaje "Hello World!"

python main.py encode --imagen images/image1.png --algoritmo lsb --mensaje "Hello World!"

python main.py encode --imagen image1.png --algoritmo dct --mensaje "Hello World!" --salida dct_image1.png

python main.py encode --imagen images/image1.png --algoritmo dct --mensaje "Hello World!" --salida results/dct_image1.png
```

### To Decode only one image

```sh
python main.py decode --imagen {INPUT_ROUTE/FILE_NAME} --algoritmo {ALGORITHM_NAME}
```

#### Examples

```sh
python main.py decode --imagen image1_lsb.png --algoritmo lsb

python main.py decode --imagen results/image1_lsb.png --algoritmo lsb
```
