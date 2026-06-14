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

## Arquitectura del Sistema

La aplicación está compuesta por los siguientes servicios, desplegados como
instancias independientes dentro de la nube institucional (VLAN 67):

### Frontend

Desarrollado con **React + Vite** y **Tailwind CSS**, con diseño responsivo.
Incluye tres vistas principales: registro, inicio de sesión y dashboard.

El dashboard emula un entorno de desarrollo (IDE) enfocado en usabilidad y
experiencia de desarrollo (DX):

* Editor de código integrado (`@monaco-editor/react`) con resaltado de
  sintaxis personalizado para el DSL del compilador.
* Paneles colapsables para comparar imágenes antes/después del análisis de
  esteganografía.
* Terminal integrada para visualizar la salida del transpilador.
* Soporte multilenguaje (inglés/español) y modo claro/oscuro.
* Manual de uso disponible en un panel lateral del dashboard.

### Backend API

Desarrollado con **FastAPI (Python)** <!-- VERIFICAR: ¿hay también un
componente en NodeJS, o se elimina esta mención? -->. Es el núcleo de
comunicación del sistema y se encarga de:

* Gestionar la autenticación de usuarios mediante JWT.
* Procesar las operaciones del compilador del DSL.
* Coordinar la comunicación con el motor de esteganografía y el modelo de CNN.
* Almacenar y consultar información en MongoDB.
* Registrar el historial de operaciones (logs).

### Backend - Modelo CNN

Instancia independiente desarrollada en **Python con PyTorch**, que aloja el
modelo entrenado. Recibe una imagen como entrada y devuelve una clasificación
multiclase: `cover / lsb / dct / pvd / bpcs`.

### Base de Datos

**MongoDB**, desplegado en un contenedor Docker dentro de su propia instancia.
Colecciones: `Users`, `Logs`, `History`.

### Balanceador de Carga

**NGINX** como punto único de entrada, redirigiendo el tráfico entre las
instancias del sistema.

---

## Infraestructura y Red

El Equipo-2 de Infraestructura tuvo asignado un router Cisco y una
computadora con Ubuntu Linux como plataforma de despliegue.

La arquitectura está desplegada sobre una nube privada conectada a la
**VLAN 67** de la red institucional. El acceso de los usuarios desde Internet
pasa por el **Router TEC**, que provee enrutamiento, DNS y NAT/PAT hacia las
instancias internas.

### Configuración del Router

```ssh
hostname Infra2

enable secret clavehub123

interface gigabitethernet 0/0/0
ip address dhcp
ip nat outside
no shutdown
exit

interface gigabitethernet 0/0/1
ip address 172.16.67.254 255.255.255.0
ip nat inside
! encapsulation dot1q 67
! ip access-group 100 in   <!-- VERIFICAR: ¿sigue pendiente o ya se aplicó? -->
no shutdown
exit

access-list 101 permit ip 172.16.67.0 0.0.0.255 any
access-list 100 permit tcp 172.16.67.0 0.0.0.255 any eq 22
access-list 100 permit tcp 172.16.67.0 0.0.0.255 any eq 443
access-list 100 deny ip any any

ip nat inside source list 101 interface gigabitethernet 0/0/0 overload

ip route 192.168.200.0 255.255.255.0 172.16.67.10
ip route 192.168.133.0 255.255.255.0 172.16.67.10
```

### Seguridad de Red

La seguridad de la solución se basa en una arquitectura multicapa:

* Segmentación mediante VLAN institucional.
* Uso de direcciones IP privadas para los servicios internos.
* NAT para ocultar la infraestructura interna frente a Internet.
* NGINX como único punto de acceso a la aplicación.
* MongoDB aislado dentro de un contenedor Docker.
* Comunicación controlada entre componentes mediante APIs internas.
* Restricción de acceso directo a la base de datos desde redes externas.

---

## Seguridad Web

* **Aislamiento de ejecución (Sandboxing):** dado que la aplicación ejecuta código generado dinámicamente, el backend aísla la ejecución de los scripts de Python.
* **Hardening:** HTTPS estricto (HSTS), CORS restringido, y sanitización de cabeceras mediante Helmet.js.

---

## Logs y Auditoría

La aplicación mantiene un registro de auditoría de las acciones de los usuarios, almacenado en la colección `logs` de MongoDB.

### ¿Qué se registra?

Cada vez que un usuario inicia sesión, se guarda un documento con la siguiente información:

| Campo | Descripción |
| --- | --- |
| `username` | Usuario que realizó la acción |
| `action` | Tipo de acción (ej. `"login"`) |
| `timestamp` | Fecha y hora en zona horaria de Ciudad de México |
| `ip_address` | Dirección IP desde la que se realizó la solicitud |

### Ejemplo de documento

```json
{
  "username": "pedro",
  "action": "login",
  "timestamp": "2026-06-10 00:14:00",
  "ip_address": "127.0.0.1"
}
```

### Consultar el historial

El endpoint `GET /users/me/logs` permite a un usuario autenticado consultar su propio historial de sesiones, ordenado del más reciente al más antiguo (máximo 50 registros). Requiere un token JWT válido.

### Propósito

Este sistema de logs sienta las bases para auditoría de seguridad — permite identificar accesos sospechosos (ej. inicios de sesión desde IPs inusuales) y será extendido en el futuro para registrar otras acciones como actualizaciones de perfil o intentos fallidos de login.

## Accesibilidad y Usabilidad

* **Navegación simplificada:** estructura de navegación reducida a las
  secciones esenciales (Inicio, Historial, Ayuda), evitando sobrecarga
  cognitiva para usuarios nuevos.
* **Internacionalización:** la interfaz incluye un selector de idioma
  (ES/EN) que permite alternar todo el contenido del frontend entre español
  e inglés en tiempo real, sin recargar la página.
* **Modo claro/oscuro:** soporte de tema claro y oscuro, permitiendo al
  usuario ajustar la interfaz según su preferencia o condiciones de
  iluminación.
* **Documentación contextual integrada:** un panel lateral con documentación
  oficial (guía rápida, conceptos clave, algoritmos y modelos soportados)
  disponible directamente desde el dashboard, reduciendo la curva de
  aprendizaje sin salir de la aplicación.
* **Múltiples formas de interacción:** las acciones principales (como subir
  una imagen para análisis) admiten tanto arrastrar y soltar (drag & drop)
  como selección manual de archivo, ofreciendo flexibilidad según el
  dispositivo o preferencia del usuario.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Estructura del Proyecto

```bash
.
├── .github
├── CONTRIBUTING.md
├── README.md
├── backend
└── frontend
└── IEEE and Slides
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Ciencias Computacionales

Esta sección demuestra la convergencia de la Teoría de Lenguajes de Programación y el Aprendizaje Profundo (Deep Learning).

### Modelo de IA

**Estegoanálisis Ciego Multiclase:**

Para la detección de mensajes ocultos se implementó una Red Neuronal Convolucional de Arquitectura Dual (Fusión Espacio-Espectral), optimizada para identificar anomalías estadísticas microscópicas en las imágenes:

* Rama Espacial (SRM): Utiliza filtros de los Spatial Rich Models para extraer las características del ruido residual en los píxeles, donde las modificaciones de esteganografía clásica (como LSB) dejan rastro.
* Rama Espectral (DCT): Transforma la imagen al dominio de la frecuencia mediante la Transformada Coseno Discreta para detectar alteraciones en los coeficientes de cuantización.
* Capa de Fusión: Las características de ambas ramas se concatenan y pasan por capas densas para generar una clasificación multiclase que identifica el algoritmo de ocultación específico (o determina si la imagen está limpia). Si se detecta un positivo, el sistema extrae el flujo binario de los bits portadores para reconstruir el texto plano.

### Compilador

**DSL (Domain-Specific Language):**

Se desarrolló un lenguaje de dominio específico diseñado exclusivamente para la manipulación, codificación y análisis de estegoimágenes. El pipeline del compilador consta de:

* Analizador Léxico y Sintáctico: Construido para validar la gramática estricta del DSL y generar un Árbol de Sintaxis Abstracta (AST).
* Verificador Semántico: Asegura la coherencia de tipos y operaciones (ej. evitar decodificaciones en archivos no válidos).
* Generador de Código (Transpilador): Traduce el AST a código ejecutable de Python 3, permitiendo una integración nativa con los modelos de IA basados en PyTorch/TensorFlow y las librerías de procesamiento de imágenes.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Configuración GitHub

### Gobernanza del desarrollo

* [`CONTRIBUTING.md`](./CONTRIBUTING.md): Guía de estilos, flujo de ramas y políticas para la creación de Pull Requests.
* Branching Strategy: Nuestra estrategia de ramas se basa en Git Flow, con ramas `main` para producción, `develop` para integración continua y ramas de características (`[issue-number]-[titulo-del-issue]`) para el desarrollo aislado de nuevas funcionalidades provenientes de issues. (Ver más en `CONTRIBUTING.md`).
* Issue & PR Templates: Plantillas personalizadas para la asignación de tareas, propuestas de nuevas features y solicitudes de revisión de código, asegurando que cada aportación cuente con el contexto técnico no solo necesario sino esperado.

### Github Actions

**Automatización e Integración Continua (CI/CD):**

* Pipelines automatizados que ejecutan linters y pruebas unitarias automáticas ante cada Push o Pull Request hacia las ramas principales, mitigando la introducción de deuda técnica.

### Gestión del Proyecto (GitHub Projects)

* Uso de un Kanban Board institucional vinculado al repositorio para el control del Backlog, asignación de responsabilidades particulares y tracking de esfuerzo.

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

[X] Configuración inicial de la infraestructura en la nube privada del laboratorio de Ciberseguridad.

[X] Diseño preliminar del DSL y definición de su gramática.

[X] Investigación acerca de los métodos de esteganografía a implementar.

### Iteration 2: Martes, Jun 09

[X] Implementación de base de datos no relacional en MongoDB.

[X] Implementeación de servicio de autenticación en el backend y base de datos. (Registro, inicio de sesion, hasheo de contraseñas, implementación de tokens JWT).

[ ] Más tareas por definir.

### Iteration 3: Miércoles, Jun 10

[X] Recolección y preprocesamiento de datasets para el entrenamiento del modelo de IA.

[ ] Más tareas por definir.

### Iteration 4: Jueves, Jun 11

[X] Entrenamiento de modelo en computadora potente del hub de ciber seguridad, conexión por ssh.

[ ] Más tareas por definir.

### Iteration 5: Viernes, Jun 12

[ ] Más tareas por definir.

[X] Diseñar slides para presentación de proyecto.

[X] Presentación final con profesor (20:30) en salón de juntas del hub de ciberseguridad.

> [!IMPORTANT]
> **Nota de Gestión:** El detalle del progreso diario, la asignación de tasks individuales y la trazabilidad de los commits asociados a cada requerimiento pueden ser consultados en la pestaña de Projects de este repositorio.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Instalación

```bash

```

### Prerequisitos

* [Node.js](https://nodejs.org/es/download)
* [Python3.11](https://www.python.org/downloads/release/python-3110/)

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
