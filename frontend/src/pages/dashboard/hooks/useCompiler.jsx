import { useState } from "react";

// Asegúrate de que tu variable de entorno apunte correctamente a tu backend (ej: http://localhost:8000)
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export function useCompiler() {
  const [logs, setLogs] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Función para agregar mensajes a la terminal (asegurando que siempre sea texto)
  const addLog = (message, type = "info") => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        message: typeof message === "object" ? JSON.stringify(message) : message,
        type, 
      },
    ]);
  };

  const clearLogs = () => setLogs([]);

  const compileCode = async (code, evidenceFile) => {
    setIsCompiling(true);
    clearLogs();
    addLog("Iniciando secuencia de compilación...", "info");

    // Validación léxica previa en cliente
    if (!evidenceFile && code.includes("LOAD")) {
      addLog("Error de Validación: Se requiere cargar una evidencia física en el Locker para ejecutar sentencias LOAD.", "error");
      setIsCompiling(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("code", code); 
      if (evidenceFile) {
        formData.append("image", evidenceFile); 
      }

      const response = await fetch(`${API_BASE_URL}/api/compiler/run`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        addLog(`[${data.type || "Compiler"} Error] ${data.message}`, "error");
      } else {
        addLog("Análisis léxico, sintáctico y semántico: OK", "success");
        addLog("Ejecutando operaciones en el core engine...", "info");
        
        // Parseamos los resultados devueltos por el CodeGenerator del backend
        if (data.details && Array.isArray(data.details)) {
          data.details.forEach((result) => {
            
            // Si es un string simple
            if (typeof result === "string") {
              addLog(result, "info");
              return;
            }

            // Si el backend reportó un error de ejecución
            if (result.error) {
              addLog(`Error en ejecución: ${result.error}`, "error");
              return;
            }

            // --- LÓGICA DE OCULTAMIENTO (ENCODE) Y DESCARGA ---
            if (result.action === "encoded") {
              addLog(`[ENCODE] Payload inyectado exitosamente en ${result.variable} (Algoritmo: ${result.algorithm}).`, "success");
              addLog(`Ruta de salida temporal: ${result.output_image}`, "info");
              addLog(`Iniciando descarga de la imagen generada...`, "info");
              
              // 1. Construir la URL hacia el endpoint de descarga en FastAPI
              const downloadUrl = `${API_BASE_URL}/api/stego/download?path=${encodeURIComponent(result.output_image)}`;
              
              // 2. Crear un elemento <a> invisible para forzar la descarga
              const link = document.createElement("a");
              link.href = downloadUrl;
              link.target = "_blank"; // Abre en nueva pestaña para prevenir bloqueos del navegador
              link.download = "evidencia_alterada.png"; // Nombre sugerido para el archivo
              
              // 3. Ejecutar el clic y limpiar el DOM
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } 
            
            // --- LÓGICA DE EXTRACCIÓN (DECODE) ---
            else if (result.action === "decoded") {
              addLog(`[DECODE] Variable ${result.variable} evaluada por IA.`, "info");
              addLog(`Modelo IA detectó algoritmo: ${result.ai_prediction}`, "info");
              
              if (result.extracted_message) {
                addLog(`Payload extraído: "${result.extracted_message}"`, "success");
              } else {
                addLog(`No se encontró mensaje oculto.`, "info");
              }
            } 
            
            // Cualquier otra acción futura
            else {
               addLog(`Resultado: ${JSON.stringify(result)}`, "info");
            }
          });
        }
      }
    } catch (error) {
      addLog("Fallo de conexión crítico con el servidor de la API.", "error");
    } finally {
      setIsCompiling(false);
    }
  };

  return { logs, isCompiling, compileCode, addLog };
}