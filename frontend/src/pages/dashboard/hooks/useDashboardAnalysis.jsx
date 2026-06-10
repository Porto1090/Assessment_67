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
  const [code, setCode] = useState(`Texto predeterminado para análisis de código.`);
  const [imageAction, setImageAction] = useState("decode");
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const pendingFileRef = useRef(null);

  const { user } = useAuthContext();

  useEffect(() => {
    if (stage !== "loading") return;

    setProgress(0);
    const imageMessages = [
      "Analyzing image...",
      "Extracting spatial SRM residuals...",
      "Running Dual-Branch StegoCNN v3...",
      "Evaluating spectral DCT block map...",
      "Saving audit logs to MongoDB...",
    ];

    const messages = imageMessages;
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
    }, 150);

    return () => clearInterval(interval);
  }, [stage]);

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

  const analyzeImage = async (file) => {
    if (!file) return;

    if (!file.type.match(/image\/(png)/)) {
      alert("Please upload a PNG image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    pendingFileRef.current = file;
    setFileName(file.name);
    setResult(null);
    setError(null);
    setStage("loading");

    try {
      // 1. DISPARAR PROCESAMIENTO AL MODELO PRINCIPAL (Tu endpoint que procesa la red)
      // Nota: Asumiendo que primero llamas a /model para que devuelva la inferencia,
      // el path de la imagen post-tratada y el estado.
      const formData = new FormData();
      formData.append("id_usuario", "equipo67"); // O el ID real del usuario logueado
      formData.append("tipo_operacion", imageAction.toUpperCase()); // "ENCODEAR" o "DECODEAR"
      formData.append("algoritmo_encriptado", "StegoCNN v3 Dual Branch");
      formData.append("file", file);

      // const responseModelo = await fetch(`${API_BASE_URL}/model`, {
      //   method: "POST",
      //   body: formData,
      // });

      const responseModelo = {
        ok: true,
        status: 200,
        json: async () => ({
          status: "success",
          message: "Predicción simulada con éxito",
          data: {
            image_path: `storage/historial_images/${file.name}`,
            estado: "Detectado",
            confianza: 0.9975,
            algoritmo: "LSB"            
          }
        })
      };

      if (!responseModelo.ok) {
        throw new Error("Error en el procesamiento del modelo de Inteligencia Artificial.");
      }

      const resModeloData = await responseModelo.json();
      const tipoOperacionMapeado = imageAction.toUpperCase() === "DECODE" ? "DECODEAR" : "ENCODEAR";

      const payloadHistorial = {
        id_usuario: user?.username,
        tipo_operacion: tipoOperacionMapeado,
        image_path: resModeloData.data?.image_path || `storage/historial_images/${file.name}`,
        algoritmo_encriptado: resModeloData.data?.algoritmo,
        estado: resModeloData.data?.estado || "Detectado",
        confianza: resModeloData.data?.confianza || 0.95
      };

      // 2. ESCRIBIR EN MONGODB MEDIANTE TU HISTORIAL ROUTER (POST /api/history)
      const responseHistorial = await fetch(`${API_BASE_URL}/api/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadHistorial),
      });

      if (!responseHistorial.ok) {
        throw new Error("No se pudo registrar la operación en el historial de MongoDB.");
      }

      const logGuardado = await responseHistorial.json();

      // 3. MAPEAR RESPUESTA AL COMPONENTE VISUAL AnalysisResults
      // Transformamos los campos de Mongo al formato exacto que espera tu vista de React
      setProgress(100);
      setResult({
        type: "image",
        detected: logGuardado.estado === "Detectado",
        model: "StegoCNN v3 (.keras)",
        confidence: (logGuardado.confianza * 100).toFixed(2), // Multiplicamos para barra de porcentaje
        duration: "Inferencia en tiempo real",
        timestamp: new Date(logGuardado.timestamp).toLocaleString(),
        message: logGuardado.estado === "Detectado"
          ? "The model has flagged this image. It contains high frequency spectral boundaries characteristic of sequential LSB insertion."
          : null,
        reasons: [
          "No encrypted content present or payload is under the detection threshold.",
          "Image high frequencies do not present abrupt discontinuities.",
          "SRM spatial residuals are uniform.",
        ],
      });
      
      setStage("done");

    } catch (err) {
      console.error(err);
      setError(err.message);
      setStage("idle");
      alert(`Error en el análisis: ${err.message}`);
    }
  };

  const downloadResults = () => {
    if (!result) return;

    const report = `
      CipherVision & StegoCNN Analysis Report
      ======================================
      Analysis Type: Image Upload (${imageAction.toUpperCase()})
      File: ${fileName}
      Status: ${result.detected ? "Stego Detected" : "Clear (Cover)"}
      Model Used: ${result.model}
      Confidence Score: ${result.confidence}%
      Timestamp: ${result.timestamp}
      
      --------------------------------------
      MongoDB Audit Sync: SUCCESS
    `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stegocnn-report-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
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