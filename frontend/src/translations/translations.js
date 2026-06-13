export const translations = {
  nav: {
    home: { en: "Home", es: "Inicio" },
    history: { en: "History", es: "Historial" },
    help: { en: "Help", es: "Ayuda" },
    darkmode: { en: "Dark", es: "Oscuro" },
    lightmode: { en: "Light", es: "Claro" },
    rights: {
      en: "© 2026 CipherVision AI. All rights reserved.",
      es: "© 2026 CipherVision AI. Todos los derechos reservados."
    }
  },
  history: {
    title: { en: "Analysis History", es: "Auditoría de IA" },
    subtitle: {
      en: "Real-time history of encodings and detections in the database.",
      es: "Historial en tiempo real de codificaciones y detecciones en la base de datos."
    },
    searchPlaceholder: { en: "Search by algorithm or file name...", es: "Buscar por algoritmo o archivo..." },
    allStatus: { en: "All Status", es: "Todos los estados" },
    detected: { en: "Detected", es: "Detectado" },
    notDetected: { en: "Not Detected", es: "Limpio" },
    allModels: { en: "All Models", es: "Todos los modelos" },
    noHistory: { en: "No Analysis History", es: "No hay registros" },
    noResults: { en: "No Results Found", es: "Sin coincidencias" },
    emptyHistory: {
      en: "Start analyzing images to see your history here.",
      es: "Aún no has procesado ninguna imagen en el sistema."
    },
    emptyResults: {
      en: "Try adjusting your filters or search query.",
      es: "Ningún resultado coincide con los filtros aplicados."
    },
    date: { en: "DATE", es: "FECHA" },
    image: { en: "IMAGE", es: "IMAGEN" },
    model: { en: "MODEL", es: "MODELO" },
    status: { en: "STATUS", es: "ESTADO IA" },
    confidence: { en: "CONFIDENCE", es: "CONFIANZA" },
    showing: { en: "Showing", es: "Mostrando" },
    of: { en: "of", es: "de" },
    results: { en: "results", es: "resultados" },
  },
  dashboard: {
    title: { en: "Recover Hidden Messages", es: "Seguridad y Esteganografía" },
    subtitle: {
      en: "Upload an image to detect hidden encrypted information using AI, or encode your own secrets securely.",
      es: "Sube una imagen para detectar información cifrada mediante IA, o codifica tus propios secretos de forma segura."
    },
  },
  actionselector: {
    encode: { en: "Encode", es: "Ocultar (Encode)" },
    decode: { en: "Decode", es: "Detectar (Decode)" },
  },
  modelselector: {
    uploadimage: { en: "Upload Image", es: "Subir Imagen" },
    writecode: { en: "Write Code", es: "Escribir Código" },
  },
  codeeditor: {
    analyzer: { en: "Source Code Analyzer", es: "Consola de Telemetría" },
    pasteorwrite: {
      en: "Review the steganographic payload execution flow.",
      es: "Revisa el flujo de ejecución del script esteganográfico."
    },
    runanalysis: { en: "Run Analysis", es: "Ejecutar Operación" }
  },
  imageuploader: {
    title: { en: "Drag & Drop your image here", es: "Arrastra y suelta tu imagen aquí" },
    subtitle: { en: "or click to browse files", es: "o haz clic para buscar archivos" },
    selectfile: { en: "Select File", es: "Seleccionar Archivo" },
    png: { en: "PNG supported", es: "Solo formato PNG (Sin pérdida)" },
    maxsize: { en: "Maximum 10MB", es: "Tamaño máximo 10MB" }
  },
  docs: {
    title: { en: "Documentation", es: "Documentación Oficial" },
    subtitle: { 
      en: "Comprehensive guide to CipherVision's Hybrid Steganography and AI Engine.", 
      es: "Guía completa del motor híbrido de Esteganografía e IA de CipherVision." 
    },
    backToDocs: { en: "Back to documentation", es: "Volver a documentación" },
    categories: {
      gettingStarted: { en: "Getting Started:", es: "Primeros Pasos:" },
      coreConcepts: { en: "Core Concepts:", es: "Conceptos Clave:" },
      support: { en: "Technical Details & Support:", es: "Detalles Técnicos y Soporte:" },
    },
    articles: {
      whatIs: {
        name: { en: "What is CipherVision?", es: "¿Qué es CipherVision?" },
        description: { 
          en: "Overview of our Hybrid AI Steganography platform.", 
          es: "Resumen de nuestra plataforma híbrida de esteganografía e IA." 
        },
        content: { 
          en: "CipherVision is an advanced hybrid security tool. It provides two main capabilities:\n\n1. ENCODE: Allows users to hide secret text inside ordinary images (Steganography) using the Least Significant Bit (LSB) algorithm without altering the visual appearance.\n2. DECODE (AI Detection): Utilizes a custom-trained Convolutional Neural Network (StegoCNN v3) to scan incoming images, detect spectral anomalies caused by hidden data, and extract the secret payload automatically.", 
          es: "CipherVision es una herramienta avanzada de seguridad híbrida. Ofrece dos capacidades principales:\n\n1. ENCODE (Ocultar): Permite a los usuarios esconder texto secreto dentro de imágenes comunes usando el algoritmo del Bit Menos Significativo (LSB) sin alterar la apariencia visual.\n2. DECODE (Detección IA): Utiliza una Red Neuronal Convolucional entrenada a medida (StegoCNN v3) para escanear imágenes entrantes, detectar anomalías espectrales causadas por datos ocultos y extraer la carga secreta automáticamente." 
        },
      },
      quickStart: {
        name: { en: "Quick Start Guide", es: "Guía Rápida de Uso" },
        description: { 
          en: "Step-by-step tutorial on how to Encode and Decode.", 
          es: "Tutorial paso a paso sobre cómo codificar y decodificar imágenes." 
        },
        content: { 
          en: "HOW TO ENCODE (Hide a Message):\n1. Select the 'Encode' tab on the main dashboard.\n2. Type your secret message in the text field.\n3. Upload a clean PNG image (Cover Image).\n4. Click 'Run Analysis'. The system will generate a 'Stego Image' that you can download safely.\n\nHOW TO DECODE (Detect & Extract):\n1. Select the 'Decode' tab.\n2. Upload a suspicious PNG image.\n3. Click 'Run Analysis'. Our StegoCNN model will analyze the file. If the confidence score is high, it will extract and display the hidden message.", 
          es: "CÓMO ENCODEAR (Ocultar un mensaje):\n1. Selecciona la pestaña 'Encode' en el panel principal.\n2. Escribe tu mensaje secreto en el campo de texto.\n3. Sube una imagen PNG limpia (Cover Image).\n4. Haz clic en 'Ejecutar Operación'. El sistema generará una imagen esteganográfica ('Stego Image') lista para descargar.\n\nCÓMO DECODEAR (Detectar y Extraer):\n1. Selecciona la pestaña 'Decode'.\n2. Sube una imagen PNG sospechosa.\n3. Haz clic en 'Ejecutar Operación'. Nuestro modelo StegoCNN analizará el archivo. Si el puntaje de confianza es alto, extraerá y mostrará el mensaje oculto en pantalla." 
        },
      },
      algorithms: {
        name: { en: "Supported Algorithms", es: "Algoritmos y Modelos Soportados" },
        description: { 
          en: "Details on LSB encoding and StegoCNN detection.", 
          es: "Detalles sobre la codificación LSB y la red StegoCNN." 
        },
        content: { 
          en: "• LSB (Least Significant Bit): This mathematical technique replaces the last bit of color value in an image's pixels with bits of the secret message. Because the modification is so minimal (changing a pixel color by a value of 1/255), it is invisible to the human eye.\n\n• StegoCNN v3 (AI Engine): Standard statistical tools often fail to detect modern steganography. Our hybrid system uses a Deep Learning Convolutional Neural Network. It analyzes pixel gradients and high-frequency noise patterns to distinguish between a natural image and one manipulated by LSB.", 
          es: "• LSB (Bit Menos Significativo): Esta técnica matemática reemplaza el último bit del valor de color en los píxeles de una imagen con los bits del mensaje secreto. Como la modificación es tan mínima (cambiar el color de un píxel en un valor de 1/255), es invisible al ojo humano.\n\n• StegoCNN v3 (Motor IA): Las herramientas estadísticas estándar suelen fallar al detectar esteganografía moderna. Nuestro sistema híbrido utiliza una Red Neuronal Convolucional de Deep Learning. Analiza gradientes de píxeles y patrones de ruido de alta frecuencia para distinguir entre una imagen natural y una manipulada por LSB." 
        },
      },
      glossary: {
        name: { en: "Glossary of Terms", es: "Glosario de Términos" },
        description: { en: "Key steganography terms explained.", es: "Explicación de términos clave de esteganografía." },
        content: { 
          en: "• Cover Image: The original, clean image used as a container.\n• Stego Image: The resulting image after a secret message has been embedded.\n• Payload: The actual secret data or text hidden inside the file.\n• Steganalysis: The practice of attacking and detecting steganography (this is what our AI does).\n• Keras/TensorFlow: The AI framework used to train our detection models.", 
          es: "• Cover Image (Imagen Cubierta): La imagen original y limpia usada como contenedor.\n• Stego Image (Imagen Estego): La imagen resultante después de haber incrustado un mensaje secreto.\n• Payload (Carga Útil): Los datos o el texto secreto en sí.\n• Esteganoanálisis: La práctica de atacar y detectar la esteganografía (esto es lo que hace nuestra IA).\n• Keras/TensorFlow: El framework de Inteligencia Artificial usado para entrenar nuestros modelos de detección." 
        },
      },
      bestPractices: {
        name: { en: "Best Practices & Limits", es: "Mejores Prácticas y Límites" },
        description: { 
          en: "Maximize detection and encoding success.", 
          es: "Maximiza el éxito de detección y codificación." 
        },
        content: { 
          en: "1. ALWAYS USE PNG: Lossy compression algorithms like JPEG will permanently destroy LSB hidden data. CipherVision strictly enforces PNG format.\n2. FILE SIZE: The maximum supported upload size is 10MB to prevent memory timeouts during AI matrix evaluation.\n3. PAYLOAD SIZE: While high-resolution images can hold large text, keeping messages concise ensures the visual integrity of the image remains perfect.", 
          es: "1. USA SIEMPRE PNG: Los algoritmos de compresión con pérdida como JPEG destruirán permanentemente los datos ocultos por LSB. CipherVision exige estrictamente el uso de formato PNG.\n2. TAMAÑO DE ARCHIVO: El tamaño máximo de subida es de 10MB para prevenir errores de memoria durante la evaluación matricial de la IA.\n3. TAMAÑO DE CARGA: Aunque las imágenes de alta resolución pueden albergar mucho texto, mantener los mensajes concisos asegura que la integridad visual de la imagen se mantenga perfecta." 
        },
      },
      architecture: {
        name: { en: "Technical Architecture", es: "Arquitectura del Sistema" },
        description: { 
          en: "Overview of the CipherVision technology stack.", 
          es: "Resumen del stack tecnológico de CipherVision." 
        },
        content: { 
          en: "CipherVision operates on a decoupled client-server architecture:\n\n• Frontend: ReactJS, TailwindCSS, and Vite for a blazing-fast UI.\n• Backend (API): FastAPI running on Python, orchestrating file handling and algorithm mapping.\n• Steganography Core: Custom Python modules utilizing OpenCV for image processing.\n• AI Inference Engine: TensorFlow loading the pre-trained StegoCNN v3 model (.keras) for real-time predictions.\n• Database: MongoDB clusters storing historical audit logs and detection telemetry.", 
          es: "CipherVision opera bajo una arquitectura cliente-servidor desacoplada:\n\n• Frontend: ReactJS, TailwindCSS y Vite para una interfaz ultra rápida.\n• Backend (API): FastAPI ejecutándose en Python, orquestando el manejo de archivos y algoritmos.\n• Núcleo Esteganográfico: Módulos personalizados en Python utilizando OpenCV.\n• Motor de Inferencia IA: TensorFlow cargando el modelo preentrenado StegoCNN v3 (.keras) para predicciones en tiempo real.\n• Base de Datos: Clústeres de MongoDB que almacenan el historial de auditorías y la telemetría." 
        },
      },
    },
  },
  help: {
    title: { en: "Help Center", es: "Centro de Ayuda" },
    subtitle: {
      en: "Learn how to use CipherVision effectively",
      es: "Aprende cómo usar CipherVision de forma efectiva"
    },
    howItWorks: { en: "How the System Works", es: "Cómo funciona el sistema" },
    howItWorksText: { 
      en: "CipherVision combines traditional cryptography (LSB) with an advanced AI neural network to both hide and detect secret payloads in images.", 
      es: "CipherVision combina criptografía tradicional (LSB) con una red neuronal de IA avanzada, permitiendo tanto ocultar como detectar cargas secretas en imágenes." 
    },
    steps: {
      uploadTitle: { en: "1. Choose Operation", es: "1. Elige la Operación" },
      uploadText: {
        en: "Select if you want to Encode (hide a message) or Decode (detect a message) and upload a PNG.", 
        es: "Selecciona si deseas Codificar (ocultar un mensaje) o Decodificar (detectar) y sube un archivo PNG." 
      },
      aiTitle: { en: "2. Hybrid Processing", es: "2. Procesamiento Híbrido" },
      aiText: {
        en: "For Encoding, we alter the image bits. For Decoding, our StegoCNN AI scans for anomalies.",
        es: "Para Ocultar, alteramos los bits de la imagen. Para Detectar, la IA StegoCNN escanea en busca de anomalías."
      },
      extractionTitle: { en: "3. Result Delivery", es: "3. Entrega de Resultados" },
      extractionText: {
        en: "Download your new Stego Image, or view the extracted hidden text on your screen.",
        es: "Descarga tu nueva imagen esteganográfica, o visualiza el texto oculto extraído en tu pantalla."
      },
      resultsTitle: { en: "4. Database Audit", es: "4. Auditoría en BD" },
      resultsText: {
        en: "Every action is logged in your History dashboard with accuracy and confidence metrics.",
        es: "Cada acción se registra en tu panel de Historial con las métricas exactas y el nivel de confianza de la IA."
      },
    },
    formats: {
      title: { en: "Supported Formats", es: "Formatos Soportados" },
      text: { en: "Strict specifications for best results.", es: "Especificaciones estrictas para resultados óptimos." },
      labelFormat: { en: "Format:", es: "Formato Permitido:" },
      labelSize: { en: "Maximum Size:", es: "Tamaño Máximo:" },
      labelResolution: { en: "Color Space:", es: "Espacio de Color:" },
      labelQuality: { en: "Compression:", es: "Compresión:" },
      qualityText: { en: "Lossless only (.PNG)", es: "Sin pérdida (.PNG) obligatorio" },
    },
    faq: {
      title: { en: "Frequently Asked Questions", es: "Preguntas Frecuentes" },
      q1: { en: "Why does it only support PNG?", es: "¿Por qué solo soporta PNG?" },
      a1: {
        en: "Because JPEG compresses images by discarding tiny color details (lossy compression). Steganography relies on those exact details, so a JPEG would destroy the secret message.",
        es: "Porque JPEG comprime descartando pequeños detalles de color (con pérdida). La esteganografía depende de esos detalles exactos, por lo que un JPEG destruiría el mensaje."
      },
      q2: { en: "How accurate is the AI detection?", es: "¿Qué tan precisa es la detección de IA?" },
      a2: {
        en: "Our StegoCNN model operates with over 90% confidence accuracy when trained on LSB anomalies.",
        es: "Nuestro modelo StegoCNN opera con una precisión de confianza superior al 90% cuando evalúa anomalías LSB."
      },
      q3: { en: "Can I download the modified image?", es: "¿Puedo descargar la imagen modificada?" },
      a3: {
        en: "Yes. When you Encode a message, a 'Download Result' button will provide the newly generated Stego Image.",
        es: "Sí. Cuando codificas un mensaje, un botón te permitirá descargar la nueva Imagen Estego generada."
      },
      q4: { en: "Why wasn't my message detected?", es: "¿Por qué no se detectó mi mensaje?" },
      a4: {
        en: "If the image was sent through WhatsApp or social media, the metadata was likely stripped and compressed, destroying the payload.",
        es: "Si la imagen fue enviada por WhatsApp o redes sociales, fue comprimida y los datos se destruyeron. Los archivos deben enviarse como 'Documentos'."
      },
      q5: { en: "Are my images stored on the server?", es: "¿Mis imágenes se guardan en el servidor?" },
      a5: {
        en: "No. Images are processed temporarily in memory and deleted immediately after the API response.",
        es: "No. Las imágenes se procesan temporalmente en la memoria del servidor y se eliminan inmediatamente tras la respuesta."
      },
    },
    security: {
      title: { en: "Security & Privacy", es: "Seguridad y Privacidad" },
      text: { 
        en: "CipherVision logs telemetry (operation type, confidence) to the database, but your actual image files and secret text are never permanently stored.", 
        es: "CipherVision registra la telemetría (tipo de operación, confianza), pero tus archivos de imagen y textos secretos nunca se almacenan de forma permanente." 
      },
    }
  },
  login: {
    usernameAndEmailRequired: { en: "Username or email is required", es: "Se requiere nombre de usuario o correo" },
    usernameRequired: { en: "Username is required", es: "Se requiere nombre de usuario" },
    passwordRequired: { en: "Password is required", es: "Se requiere contraseña" },
    emailRequired: { en: "Email is required", es: "Se requiere correo electrónico" },
    invalidEmail: { en: "Please enter a valid email", es: "Por favor, ingresa un correo electrónico válido" },
    passwordMinLength: { en: "Password must be at least 8 characters", es: "La contraseña debe tener al menos 8 caracteres" },
    title: { en: "Welcome back", es: "Bienvenido de nuevo" },
    subtitle: { en: "Sign in to continue using CipherVision.", es: "Inicia sesión para continuar usando CipherVision." },
    usernameLabel: { en: "Username", es: "Nombre de usuario" },
    usernamePlaceholder: { en: "Enter your username", es: "Ingresa tu nombre de usuario" },
    usernameEmailLabel: { en: "Username/Email", es: "Nombre de usuario o email" },
    emailLabel: { en: "Email Address", es: "Correo electrónico" },
    emailPlaceholder: { en: "Enter your email", es: "Ingresa tu correo electrónico" },
    usernameEmailPlaceholder: { en: "Enter your username or email", es: "Ingresa tu nombre o correo" },
    passwordLabel: { en: "Password", es: "Contraseña" },
    passwordPlaceholder: { en: "Enter your password", es: "Ingresa tu contraseña" },
    signin: { en: "Sign In", es: "Iniciar sesión" },
    signingin: { en: "Signing in...", es: "Iniciando sesión..." },
    createnewAccount: { en: "Creating account...", es: "Creando cuenta..." },
    createAccount: { en: "Create Account", es: "Crear Cuenta" },
    createTitle: { en: "Create your account", es: "Crea tu cuenta" },
    createSubtitle: { en: "Create an account to access Steganography tools.", es: "Crea una cuenta para acceder a las herramientas." },
    backToLogin: { en: "Back to Sign In", es: "Regresar al Iniciar Sesión" },
  },
  logout: {
    cancel: { en: "Cancel", es: "Cancelar" },
    logout: { en: "Logout", es: "Cerrar sesión" },
    title: { en: "Confirm Logout", es: "Confirmar cierre de sesión" },
    subtitle: { en: "Are you sure you want to log out of your account?", es: "¿Estás seguro de que quieres cerrar sesión?" },
  }
};