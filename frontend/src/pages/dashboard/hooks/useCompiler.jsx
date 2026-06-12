import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
export function useCompiler() {
  const [logs, setLogs] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Función para agregar mensajes a la terminal
  const addLog = (message, type = "info") => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        message,
        type, // 'info', 'error', 'success'
      },
    ]);
  };

  const clearLogs = () => setLogs([]);

  const compileCode = async (code, evidenceFile) => {
    setIsCompiling(true);
    clearLogs();
    addLog("Iniciando secuencia de compilación...", "info");

    // Validación temprana en frontend
    if (!evidenceFile && code.includes("LOAD")) {
      addLog("Error: Se requiere cargar una evidencia en el Locker.", "error");
      setIsCompiling(false);
      return;
    }

    try {
      // Usamos FormData para mandar texto + archivo al mismo endpoint
      const formData = new FormData();
      formData.append("source_code", code);
      if (evidenceFile) {
        formData.append("file", evidenceFile);
      }

      // Reemplaza esta URL con la de tu endpoint real de FastAPI
      const response = await fetch(`${API_BASE_URL}/compiler/compile`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "error") {
        addLog(`[${data.type} Error] ${data.message}`, "error");
      } else {
        addLog("Análisis léxico, sintáctico y semántico: OK", "success");
        addLog("Ejecutando operaciones en el core engine...", "info");
        // Si el backend devuelve resultados, los puedes loggear aquí
      }
    } catch (error) {
      addLog("Fallo de conexión con el servidor de Assessment67.", "error");
    } finally {
      setIsCompiling(false);
    }
  };

  return { logs, isCompiling, compileCode, addLog };
}