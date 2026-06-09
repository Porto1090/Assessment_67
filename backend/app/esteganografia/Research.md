# Investigación de Algoritmos de Esteganografía

## Objetivo

Investigar e implementar diferentes algoritmos de esteganografía para ocultar información dentro de imágenes digitales, evaluando su funcionamiento y viabilidad para integrarlos en el proyecto.

---

## Algoritmos implementados

### DCT (Discrete Cosine Transform)

DCT es una técnica de esteganografía en el dominio de la frecuencia. En lugar de modificar directamente los píxeles de la imagen, transforma la información de la imagen mediante la Transformada Discreta del Coseno y utiliza ciertos coeficientes para ocultar el mensaje.

#### Características

* Ocultamiento en el dominio de la frecuencia.
* Menor impacto visual en comparación con métodos espaciales simples.
* Compatible con imágenes convertidas a formato PNG para evitar pérdidas de información.
* Permite recuperar correctamente el mensaje oculto.

#### Estado

* Investigación completada.
* Prototipo funcional implementado.
* Inserción y recuperación de mensajes validadas.

---

### BPCS (Bit Plane Complexity Segmentation)

BPCS es una técnica que aprovecha los planos de bits complejos de una imagen para ocultar información. Los bloques con alta complejidad visual son utilizados para almacenar datos sin generar cambios perceptibles para el usuario.

#### Características

* Conversión mediante Gray Code.
* Análisis de complejidad de bloques.
* Conjugation automática para bloques con baja complejidad.
* Uso de un mapa de conjugación para la recuperación correcta.
* Selección pseudoaleatoria de bloques mediante una clave.
* Recuperación exacta del mensaje oculto.

#### Estado

* Investigación completada.
* Prototipo funcional implementado.
* Inserción y recuperación de mensajes validadas.

---

### PVD (Pixel Value Differencing)

Técnica basada en las diferencias entre píxeles vecinos para determinar la cantidad de información que puede ocultarse.

### LSB (Least Significant Bit)

Método clásico de esteganografía que modifica los bits menos significativos de los píxeles para almacenar información.
