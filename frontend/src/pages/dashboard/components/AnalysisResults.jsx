import { ShieldCheck, ShieldAlert, Download, RotateCcw, FileText, Terminal, KeyRound } from "lucide-react";
import Button from "@/components/Button";

export default function AnalysisResults({ result, resetAnalysis, downloadResults }) {
  const isDecode = result.action === "decode";

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-lg text-left">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-5 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {isDecode ? "Módulo de Extracción e Inferencia" : "Módulo de Ocultamiento"}
          </span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
            {isDecode ? "Resultados del Análisis Híbrido" : "Codificación Exitosa"}
          </h2>
        </div>
        
        <div className="flex gap-2.5">
          <Button variant="secondary" icon={<RotateCcw className="w-4 h-4" />} onClick={resetAnalysis}>
            Nueva Operación
          </Button>
          <Button variant="primary" icon={<Download className="w-4 h-4" />} onClick={downloadResults}>
            {isDecode ? "Descargar Reporte" : "Descargar Imagen Stego"}
          </Button>
        </div>
      </div>

      {/* RENDER CUANDO LA ACCION ES DECODE */}
      {isDecode ? (
        <div className="space-y-6">
          {/* ESTATUS DE DETECCIÓN POR IA */}
          <div className={`p-4 rounded-xl border flex items-start gap-4 ${
            result.detected 
              ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200" 
              : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200"
          }`}>
            {result.detected ? <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" /> : <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />}
            <div>
              <h4 className="font-bold text-base">
                {result.detected ? `Contenido Esteganográfico Detectado: [${result.prediction}]` : "Imagen Limpia / No Detectada (Cover)"}
              </h4>
              <p className="text-sm opacity-90 mt-1">
                {result.detected 
                  ? "La API de inferencia de IA ha clasificado patrones matemáticos abruptos compatibles con inserciones artificiales de datos en los pixeles."
                  : "La red neuronal determinó que la imagen se comporta como un contenedor limpio o está por debajo del umbral estándar."}
              </p>
            </div>
          </div>

          {/* TELEMETRIA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-xs uppercase font-bold">Motor Analítico:</span>
              <span className="text-slate-800 dark:text-slate-200 mt-1 block">{result.model}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-xs uppercase font-bold">Fecha / Hora de Ejecución:</span>
              <span className="text-slate-800 dark:text-slate-200 mt-1 block">{result.timestamp}</span>
            </div>
          </div>

          {/* CUADRO DE TEXTO EXTRAÍDO */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
              <Terminal className="w-4 h-4 text-indigo-500" />
              <span>Mensaje Secreto Extraído (Decoded Payload)</span>
            </div>
            <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-sm border border-slate-800 min-h-[80px] flex items-center">
              {result.extractedMessage ? (
                <span className="text-emerald-400 break-all">{result.extractedMessage}</span>
              ) : (
                <span className="text-slate-500 italic">[Ningún mensaje extraído del contenedor pixelar]</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* RENDER CUANDO LA ACCION ES ENCODE */
        <div className="space-y-6">
          <div className="p-4 rounded-xl border bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200 flex items-start gap-4">
            <KeyRound className="w-6 h-6 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h4 className="font-bold text-base">Incrustación Finalizada Exitosamente</h4>
              <p className="text-sm opacity-90 mt-1">
                El payload ha sido inyectado utilizando las reglas estructurales del algoritmo matemático seleccionado. La descarga contiene la imagen procesada lista para su transmisión segura.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-xs uppercase font-bold">Algoritmo Utilizado:</span>
              <span className="text-slate-800 dark:text-slate-200 mt-1 block uppercase font-mono">{result.algorithmUsed}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-xs uppercase font-bold">Ruta del Storage Temporal:</span>
              <span className="text-slate-500 dark:text-slate-400 mt-1 block font-mono text-xs truncate">{result.outputImagePath}</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 p-5 rounded-xl text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              ¿Listo para almacenar la imagen con la información oculta?
            </p>
            <Button variant="primary" icon={<Download className="w-4 h-4" />} onClick={downloadResults}>
              Descargar Imagen Encriptada (.png)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
