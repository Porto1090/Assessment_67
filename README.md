<a id="readme-top"></a>
# Assessment67
## Plataforma de Ciber-Forense con un Compilador Dedicado e Inteligencia Artificial Híbrida

<p align="center">
  <a href="#infraestructura">Infraestructura</a> •
  <a href="#aplicación-web">Aplicación Web</a> •
  <a href="#ciencias-computacionales">Ciencias Computacionales</a> •
  <a href="#instalación">Instalación</a>
</p>

## Abstract

**Assessment67** es una plataforma ciber-forense integral de estegoanálisis y ocultamiento de información que unifica la teoría de compiladores, el aprendizaje profundo (*Deep Learning*) y la ingeniería de software segura. El ecosistema está diseñado para ofrecer un entorno de desarrollo e investigación capaz de codificar y decodificar datos en medios digitales mediante dos componentes centrales:

1. **Un Compilador DSL Dedicado:** Integrado en una interfaz web tipo IDE, el sistema procesa un lenguaje de dominio específico personalizado. Cuenta con un pipeline completo de análisis (léxico, sintáctico y semántico) que valida y transpila las instrucciones del usuario para ejecutar algoritmos clásicos de esteganografía.
2. **Un Modelo de IA Híbrido:** Para el estegoanálisis ciego, se implementó una Red Neuronal Convolucional (CNN) de arquitectura dual basada en ramas espaciales (SRM) y espectrales (DCT). El modelo clasifica de forma multiclase si un archivo contenedor aloja información oculta, identifica el algoritmo utilizado y extrae el flujo binario en texto plano para el usuario.

Toda la plataforma se encuentra desplegada en la infraestructura privada del Laboratorio de Ciberseguridad, utilizando una arquitectura de red física escalable, redundante y de alta disponibilidad mediante nodos de cómputo gestionados con OpenStack Horizon y balanceo de carga con Nginx.

<details>
  <summary>Tabla de Contenidos (extendida)</summary>
  <ol>
    <li>
      <a href="#infraestructura">Infraestructura</a>
      <ul>
        <li><a href="#equipo-de-infraestructura">Equipo de Infraestructura</a></li>
        <li><a href="#configuración-red">Configuración Red</a></li>
        <li><a href="#seguridad-red">Seguridad Red</a></li>
        <li><a href="#salida-a-internet">Salida a Internet</a></li>
      </ul>
    </li>
    <li>
      <a href="#aplicación-web">Aplicación Web</a>
      <ul>
        <li><a href="#frontend">Frontend</a></li>
        <li><a href="#backend">Backend</a></li>
        <li><a href="#base-de-datos">Base de Datos</a></li>
        <li><a href="#seguridad-web">Seguridad Web</a></li>
        <li><a href="#manejo-de-usuarios">Manejo de usuarios</a></li>
        <li><a href="#logs-y-auditoría">Logs y Auditoría</a></li>
        <li><a href="#accesibilidad-y-usabilidad">Accesibilidad y Usabilidad</a></li>
      </ul>
    </li>
    <li>
      <a href="#ciencias-computacionales">Ciencias Computacionales</a>
      <ul>
        <li><a href="#modelo-de-ia">Modelo de IA</a></li>
        <li><a href="#compilador">Compilador</a></li>
      </ul>
    </li>
    <li><a href="#configuración-github">Configuración GitHub</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#instalación">Instalación</a></li>
    <li><a href="#integrantes">Integrantes</a></li>
  </ol>
</details>

## Infraestructura

### Equipo de Infraestructura
** Servidor Ubuntu Linux como plataforma principal de despliegue.
* Balanceador de carga NGINX configurado como punto de entrada de la aplicación.
* Router institucional del TEC encargado de proporcionar acceso a Internet, DNS y NAT.
* Router del equipo para la administración de la red local del proyecto.
* Dos instancias Frontend desarrolladas con React y Vite para garantizar disponibilidad del servicio.
* Backend API desarrollado con Node.js y FastAPI.
* Backend de Inteligencia Artificial desarrollado en Python para la ejecución del modelo de estegoanálisis.
* Base de datos MongoDB desplegada dentro de un contenedor Docker.
* Infraestructura alojada en una nube privada institucional.*.

### Configuración Red
*La arquitectura se encuentra desplegada sobre una nube privada conectada a la VLAN 67 de la red institucional. El acceso de los usuarios inicia desde Internet a través del Router TEC, el cual proporciona servicios de enrutamiento, DNS y NAT.

Posteriormente, el tráfico es recibido por un segundo router perteneciente al equipo de desarrollo y redirigido hacia un balanceador de carga NGINX. Este componente expone el Frontend a los usuarios de la red del TEC y gestiona la comunicación con los servicios internos alojados en la nube privada.

La aplicación está compuesta por:

* Dos instancias Frontend (React + Vite).
* Un Backend API encargado de la lógica de negocio.
* Un Backend IA encargado de ejecutar el modelo de Deep Learning.
* Una base de datos MongoDB desplegada mediante Docker.*.

### Seguridad Red
*La seguridad de la solución se basa en una arquitectura multicapa:

* Segmentación mediante VLAN institucional.
* Uso de direcciones IP privadas para los servicios internos.
* NAT para ocultar la infraestructura interna frente a Internet.
* Balanceador NGINX como único punto de acceso a la aplicación.
* Base de datos MongoDB aislada dentro de un contenedor Docker.
* Separación lógica entre Frontend, Backend API y Backend IA.
* Comunicación controlada entre componentes mediante APIs internas.
* Restricción de acceso directo a la base de datos desde redes externas.*.

### Salida a Internet
*La salida a Internet es proporcionada por el Router TEC, el cual administra la conectividad externa de la infraestructura mediante servicios de enrutamiento, resolución DNS y traducción de direcciones (NAT). Esto permite que los servicios desplegados en la nube privada puedan acceder a recursos externos y recibir solicitudes de los usuarios manteniendo la seguridad de la red interna.*.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Aplicación Web

### Frontend 
**IDE de Desarrollo Integrado**

La interfaz de usuario emula un entorno de desarrollo profesional (IDE) enfocado en la usabilidad y la experiencia de desarrollo (DX):
Construido con React y Tailwind CSS, ofreciendo un diseño responsivo, paneles colapsables para la visualización de imágenes antes/después del análisis, y una terminal integrada para los outputs del transpilador.

- **Core:** Integración de `@monaco-editor/react` para proveer un editor de código enriquecido con resaltado de sintaxis (*syntax highlighting*) personalizado para nuestro DSL.

### Backend
*El Backend API fue desarrollado con Python y FastAPI, y actúa como el núcleo de comunicación del sistema. Su función principal es recibir las solicitudes del frontend, gestionar la autenticación de usuarios mediante JWT, procesar las operaciones del compilador DSL, coordinar la comunicación con el motor de esteganografía y el modelo de inteligencia artificial, así como almacenar y consultar información en la base de datos MongoDB. Además, registra el historial de operaciones realizadas por los usuarios, permitiendo mantener un control y seguimiento de las actividades del sistema. Gracias a esta arquitectura, se centraliza la lógica de negocio, se mejora la seguridad y se facilita el mantenimiento y la escalabilidad de la aplicación.*.

### Base de Datos
*La Base de Datos fue implementada utilizando MongoDB y se encarga de almacenar de forma segura toda la información generada por el sistema. Entre los datos gestionados se encuentran los usuarios registrados, los historiales de análisis realizados, los registros de actividad y la información necesaria para el funcionamiento de la aplicación. Al utilizar una base de datos NoSQL, el sistema puede manejar estructuras de datos flexibles y escalar fácilmente conforme aumenta el volumen de información. Además, su integración con el Backend API permite realizar consultas y actualizaciones de manera eficiente, garantizando la disponibilidad y consistencia de los datos.*.

### Seguridad Web
- Mitigación de Riesgos de Inyección: Dado que la aplicación ejecuta código generado dinámicamente, el backend implementa un mecanismo de aislamiento (Sandboxing) para ejecutar los scripts de Python de forma segura.
- Políticas de Hardening: Implementación de HTTPS estricto (HSTS), control de acceso orientado a recursos mediante CORS restringido, y sanitización exhaustiva de cabeceras mediante Helmet.js.

### Logs y Auditoría
*Por definir*.

### Accesibilidad y Usabilidad
*Por definir*.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Estructura del Proyecto

```bash
.
├── .github
├── CONTRIBUTING.md
├── README.md
├── backend
└── frontend
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Ciencias Computacionales
Esta sección demuestra la convergencia de la Teoría de Lenguajes de Programación y el Aprendizaje Profundo (Deep Learning).

### Modelo de IA
**Estegoanálisis Ciego Multiclase**

Para la detección de mensajes ocultos se implementó una Red Neuronal Convolucional de Arquitectura Dual (Fusión Espacio-Espectral), optimizada para identificar anomalías estadísticas microscópicas en las imágenes:

- Rama Espacial (SRM): Utiliza filtros de los Spatial Rich Models para extraer las características del ruido residual en los píxeles, donde las modificaciones de esteganografía clásica (como LSB) dejan rastro.
- Rama Espectral (DCT): Transforma la imagen al dominio de la frecuencia mediante la Transformada Coseno Discreta para detectar alteraciones en los coeficientes de cuantización.
- Capa de Fusión: Las características de ambas ramas se concatenan y pasan por capas densas para generar una clasificación multiclase que identifica el algoritmo de ocultación específico (o determina si la imagen está limpia). Si se detecta un positivo, el sistema extrae el flujo binario de los bits portadores para reconstruir el texto plano.

### Compilador
**DSL (Domain-Specific Language)**

Se desarrolló un lenguaje de dominio específico diseñado exclusivamente para la manipulación, codificación y análisis de estegoimágenes. El pipeline del compilador consta de:

- Analizador Léxico y Sintáctico: Construido para validar la gramática estricta del DSL y generar un Árbol de Sintaxis Abstracta (AST).
- Verificador Semántico: Asegura la coherencia de tipos y operaciones (ej. evitar decodificaciones en archivos no válidos).
- Generador de Código (Transpilador): Traduce el AST a código ejecutable de Python 3, permitiendo una integración nativa con los modelos de IA basados en PyTorch/TensorFlow y las librerías de procesamiento de imágenes.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Configuración GitHub

### Gobernanza del desarrollo

- [`CONTRIBUTING.md`](./CONTRIBUTING.md): Guía de estilos, flujo de ramas y políticas para la creación de Pull Requests.
- Branching Strategy: Nuestra estrategia de ramas se basa en Git Flow, con ramas `main` para producción, `develop` para integración continua y ramas de características (`[issue-number]-[titulo-del-issue]`) para el desarrollo aislado de nuevas funcionalidades provenientes de issues. (Ver más en `CONTRIBUTING.md`).
- Issue & PR Templates: Plantillas personalizadas para la asignación de tareas, propuestas de nuevas features y solicitudes de revisión de código, asegurando que cada aportación cuente con el contexto técnico no solo necesario sino esperado.

### Github Actions
**Automatización e Integración Continua (CI/CD):**

- Pipelines automatizados que ejecutan linters y pruebas unitarias automáticas ante cada Push o Pull Request hacia las ramas principales, mitigando la introducción de deuda técnica.

### Gestión del Proyecto (GitHub Projects):

- Uso de un Kanban Board institucional vinculado al repositorio para el control del Backlog, asignación de responsabilidades particulares y tracking de esfuerzo.
> *Cada hito del proyecto se desglosa en issues con tareas diarias asignadas a los integrantes para asegurar un flujo de desarrollo continuo y auditable.*

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

> **Nuestro plan de iteraciones es gestionado en el GitHub Project a través de asignaciones diarias y objetivos semanales**

### Iteration 0: FindeSemana, Jun 06-07

[X] Creación del repositortio y configuración básica del mismo.
[X] Organización del equipo, asignación de roles y responsabilidades.
[X] Organización de los directorios de código, documentación y recursos.
[X] Establecer scope del proyecto, definir requerimientos y diseñar la arquitectura general de la plataforma.

### Iteration 1: Lunes, Jun 08

[ ] Configuración inicial de la infraestructura en la nube privada del laboratorio de Ciberseguridad.
[ ] Diseño preliminar del DSL y definición de su gramática.
[ ] Recolección y preprocesamiento de datasets para el entrenamiento del modelo de IA.

### Iteration 2: Martes, Jun 09

[ ] Por definir tareas específicas.

### Iteration 3: Miércoles, Jun 10

[ ] Por definir tareas específicas.

### Iteration 4: Jueves, Jun 11

[ ] Por definir tareas específicas.

### Iteration 5: Viernes, Jun 12

[ ] Por definir tareas específicas.

> [!IMPORTANT]
> **Nota de Gestión:** El detalle del progreso diario, la asignación de tasks individuales y la trazabilidad de los commits asociados a cada requerimiento pueden ser consultados en la pestaña de Projects de este repositorio.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Instalación


### Prerequisitos

- [Node.js](https://nodejs.org/es/download)
- [Python3.11](https://www.python.org/downloads/release/python-3110/)

### Instalación Manual

```bash
# Clonar el repositorio
git clone https://github.com/Porto1090/Assessment_67
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Integrantes

<a href="https://github.com/Porto1090/Assessment_67/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Porto1090/Assessment_67" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

<p align="right">(<a href="#readme-top">back to top</a>)</p>
