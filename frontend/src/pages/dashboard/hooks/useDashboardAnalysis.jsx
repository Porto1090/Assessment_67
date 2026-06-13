import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "@/context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function useDashboardAnalysis() {
  const [mode, setMode] = useState("image");
  const [stage, setStage] = useState("idle");
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing analysis...");
  const [code, setCode] = useState(`// Escribe tu script StegoScript aquí\nLOAD "evidencia.png"\nEXTRACT LSB;`);
  const [imageAction, setImageAction] = useState("decode"); // "decode" o "encode"
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (stage !== "loading") return;

    setProgress(0);
    const messages = imageAction === "decode" 
      ? [
          "Analyzing image...",
          "Querying Hybrid AI Inference Engine...",
          "Evaluating spectral DCT block maps...",
          "Running localized extraction handlers...",
          "Finalizing telemetry audit logs..."
        ]
      : [
          "Loading cover source file...",
          "Allocating bitstream payload...",
          "Applying steganographic math matrix...",
          "Compiling output stego-image data...",
          "Finalizing stream delivery buffers..."
        ];

    let currentMessage = 0;
    setLoadingMessage(messages[0]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; 
        const next = prev + 5;

        const messageIndex = Math.min(
          Math.floor(next / 20),
          messages.length - 1
        );

        if (messageIndex !== currentMessage) {
          currentMessage = messageIndex;
          setLoadingMessage(messages[messageIndex]);
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [stage, imageAction]);

  const resetAnalysis = () => {
    setStage("idle");
    setResult(null);
    setFileName("");
    setProgress(0);
    setLoadingMessage("Initializing analysis...");
    setError(null);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    resetAnalysis();
  };

  const analyzeImage = async (file, message = "", algorithm = "") => {
    if (!file) return;

    if (!file.type.match(/image\/(png)/)) {
      alert("Please upload a valid image file (PNG)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setFileName(file.name);
    setResult(null);
    setError(null);
    setStage("loading");

    try {
      const formData = new FormData();

      if (imageAction === "decode") {
        // FLUJO DECODIFICACIÓN HÍBRIDA
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}/api/stego/decode`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.detail || "Error en el proceso de decodificación híbrida.");
        }

        const data = await response.json();
        
        // Sincronización opcional con MongoDB History
        try {
          await fetch(`${API_BASE_URL}/api/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_usuario: user?.username || "anonymous",
              tipo_operacion: "DECODEAR",
              image_path: `storage/processed/${file.name}`,
              algoritmo_encriptado: data.ai_prediction || "Unknown",
              estado: data.ai_prediction !== "Cover" ? "Detectado" : "Limpio",
              confianza: data.ai_metadata?.prediccion?.confianza || 1.0
            }),
          });
        } catch (mongoErr) {
          console.warn("MongoDB Log Sync Skip:", mongoErr.message);
        }

        setProgress(100);
        setResult({
          type: "image",
          action: "decode",
          detected: data.ai_prediction !== "Cover" && data.ai_prediction !== null,
          model: "StegoCNN v3 (.keras) Hybrid",
          prediction: data.ai_prediction,
          extractedMessage: data.extracted_message,
          metadata: data.ai_metadata,
          timestamp: new Date().toLocaleString(),
        });
        setStage("done");

      } else {
        // FLUJO CODIFICACIÓN LOCAL (ENCODE)
        formData.append("file", file);
        formData.append("message", message);
        formData.append("algorithm", algorithm);

        const response = await fetch(`${API_BASE_URL}/api/stego/encode`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.detail || "Error en el proceso de codificación local.");
        }

        const data = await response.json();

        setProgress(100);
        setResult({
          type: "image",
          action: "encode",
          algorithmUsed: data.algorithm_used,
          outputImagePath: data.output_image_path,
          timestamp: new Date().toLocaleString(),
        });
        setStage("done");
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
      setStage("idle");
      alert(`Error en la operación: ${err.message}`);
    }
  };

  const downloadResults = () => {
    if (!result) return;

    if (result.action === "encode" && result.outputImagePath) {
      // Descarga directa de la imagen stego procesada desde la carpeta temporal
      window.open(`${API_BASE_URL}/api/stego/download?path=${encodeURIComponent(result.outputImagePath)}`, "_blank");
    } else {
      // Descarga de reporte textual para decodificación
      const report = `
        CipherVision & StegoCNN Analysis Report
        ======================================
        Analysis Type: Image Extraction (DECODE)
        File Analyzed: \${fileName}
        AI Target Class Prediction: \${result.prediction || "Cover (Clean)"}
        Payload Extraction Status: \${result.detected ? "Payload Found" : "No Stego Content"}
        Extracted Secret Message: \${result.extractedMessage || "None"}
        Timestamp: \${result.timestamp}
      `.trim();

      const blob = new Blob([report], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `stego-decode-report-\${Date.now()}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return {
    mode, changeMode,
    stage,
    result, downloadResults, resetAnalysis,
    fileName,
    progress, loadingMessage,
    code, setCode,
    fileInputRef, analyzeImage,
    imageAction, setImageAction,
    error
  };
}
