import { FileImage, Brain, HelpCircle, Shield } from "lucide-react";
import { useLanguage } from "@/translations/LanguageContext";

export default function Help() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Help Center",
      subtitle: "Learn how to use CipherVision effectively",
      howItWorks: "How the System Works",
      howItWorksText:
        "CipherVision uses advanced machine learning models to detect and recover hidden encrypted messages embedded inside images.",
      uploadTitle: "1. Upload an Image",
      uploadText:
        "Upload a JPG, JPEG, or PNG image that may contain hidden information.",
      aiTitle: "2. AI Analysis",
      aiText:
        "CNN and SVM models analyze image patterns looking for hidden encrypted content.",
      extractionTitle: "3. Message Extraction",
      extractionText:
        "If a hidden message is detected, the system extracts and displays the recovered content.",
      resultsTitle: "4. Results & History",
      resultsText:
        "Download your results and access previous analyses through the History section.",
      formatsTitle: "Supported Formats",
      formatsText: "Recommended specifications for best results.",
      format: "Format:",
      maxSize: "Maximum Size:",
      resolution: "Recommended Resolution:",
      quality: "Best Quality:",
      qualityText: "Uncompressed images",
      faq: "Frequently Asked Questions",
      q1: "What is steganography?",
      a1:
        "Steganography hides secret information inside ordinary files or images without revealing that data exists.",
      q2: "How accurate is the AI?",
      a2:
        "Detection confidence typically ranges from 80% to 99% when hidden content is present.",
      q3: "What are CNN and SVM?",
      a3:
        "They are machine learning models used to identify hidden patterns and encrypted data in images.",
      q4: "Why wasn't a message detected?",
      a4:
        "The image may not contain hidden data, the quality may be insufficient, or the encoding method may not be supported.",
      q5: "Is my data secure?",
      a5: "All analysis is performed locally in your browser.",
      securityTitle: "Security & Privacy",
      securityText:
        "CipherVision is intended for educational and research purposes. Images are analyzed locally and are not sent to external servers.",
    },

    es: {
      title: "Centro de Ayuda",
      subtitle: "Aprende cómo usar CipherVision de forma efectiva",
      howItWorks: "Cómo funciona el sistema",
      howItWorksText:
        "CipherVision utiliza modelos avanzados de aprendizaje automático para detectar y recuperar mensajes cifrados ocultos dentro de imágenes.",
      uploadTitle: "1. Sube una Imagen",
      uploadText:
        "Sube una imagen JPG, JPEG o PNG que pueda contener información oculta.",
      aiTitle: "2. Análisis con IA",
      aiText:
        "Los modelos CNN y SVM analizan patrones en la imagen para buscar contenido cifrado oculto.",
      extractionTitle: "3. Extracción del Mensaje",
      extractionText:
        "Si se detecta un mensaje oculto, el sistema lo extrae y muestra el contenido recuperado.",
      resultsTitle: "4. Resultados e Historial",
      resultsText:
        "Descarga tus resultados y accede a análisis anteriores desde la sección de Historial.",
      formatsTitle: "Formatos Soportados",
      formatsText: "Especificaciones recomendadas para mejores resultados.",
      format: "Formato:",
      maxSize: "Tamaño Máximo:",
      resolution: "Resolución Recomendada:",
      quality: "Mejor Calidad:",
      qualityText: "Imágenes sin compresión",
      faq: "Preguntas Frecuentes",
      q1: "¿Qué es la esteganografía?",
      a1:
        "La esteganografía oculta información secreta dentro de archivos o imágenes comunes sin revelar que esos datos existen.",
      q2: "¿Qué tan precisa es la IA?",
      a2:
        "La confianza de detección normalmente va del 80% al 99% cuando hay contenido oculto presente.",
      q3: "¿Qué son CNN y SVM?",
      a3:
        "Son modelos de aprendizaje automático utilizados para identificar patrones ocultos y datos cifrados en imágenes.",
      q4: "¿Por qué no se detectó un mensaje?",
      a4:
        "La imagen puede no contener datos ocultos, la calidad puede ser insuficiente o el método de codificación puede no estar soportado.",
      q5: "¿Mis datos están seguros?",
      a5: "Todo el análisis se realiza localmente en tu navegador.",
      securityTitle: "Seguridad y Privacidad",
      securityText:
        "CipherVision está pensado para fines educativos y de investigación. Las imágenes se analizan localmente y no se envían a servidores externos.",
    },
  };

  const t = content[language];

  return (
    <div
      className="min-h-[calc(100vh-64px)] py-12"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1
            className="mb-3"
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#1E293B",
            }}
          >
            {t.title}
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#64748B",
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0"
              style={{ backgroundColor: "#EFF6FF" }}
            >
              <Brain className="w-6 h-6" style={{ color: "#3B82F6" }} />
            </div>

            <div>
              <h2
                className="mb-2"
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1E293B",
                }}
              >
                {t.howItWorks}
              </h2>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                  lineHeight: "1.6",
                }}
              >
                {t.howItWorksText}
              </p>
            </div>
          </div>

          <div className="space-y-4 ml-16">
            {[
              [t.uploadTitle, t.uploadText],
              [t.aiTitle, t.aiText],
              [t.extractionTitle, t.extractionText],
              [t.resultsTitle, t.resultsText],
            ].map(([title, text]) => (
              <div
                key={title}
                className="p-4 rounded-lg"
                style={{ backgroundColor: "#F8FAFC" }}
              >
                <h3
                  className="mb-2"
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1E293B",
                  }}
                >
                  {title}
                </h3>

                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748B",
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg"
              style={{ backgroundColor: "#EFF6FF" }}
            >
              <FileImage className="w-6 h-6" style={{ color: "#3B82F6" }} />
            </div>

            <div>
              <h2
                className="mb-2"
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1E293B",
                }}
              >
                {t.formatsTitle}
              </h2>

              <p style={{ fontSize: "14px", color: "#64748B" }}>
                {t.formatsText}
              </p>
            </div>
          </div>

          <div className="space-y-4 ml-16">
            <p>
              <strong>{t.format}</strong> JPG / JPEG / PNG
            </p>
            <p>
              <strong>{t.maxSize}</strong> 10 MB
            </p>
            <p>
              <strong>{t.resolution}</strong> 800x600+
            </p>
            <p>
              <strong>{t.quality}</strong> {t.qualityText}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg"
              style={{ backgroundColor: "#EFF6FF" }}
            >
              <HelpCircle className="w-6 h-6" style={{ color: "#3B82F6" }} />
            </div>

            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#1E293B",
              }}
            >
              {t.faq}
            </h2>
          </div>

          <div className="space-y-6 ml-16">
            {[
              [t.q1, t.a1],
              [t.q2, t.a2],
              [t.q3, t.a3],
              [t.q4, t.a4],
              [t.q5, t.a5],
            ].map(([question, answer]) => (
              <div key={question}>
                <h3 className="font-semibold mb-2">{question}</h3>
                <p className="text-slate-500">{answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-8 p-6 rounded-xl border"
          style={{
            backgroundColor: "#EFF6FF",
            borderColor: "#3B82F6",
          }}
        >
          <div className="flex items-start gap-3">
            <Shield
              className="w-6 h-6 flex-shrink-0"
              style={{ color: "#3B82F6" }}
            />

            <div>
              <h3
                className="mb-2"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                {t.securityTitle}
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                  lineHeight: "1.6",
                }}
              >
                {t.securityText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}