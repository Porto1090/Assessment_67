import { Play, UploadCloud, FileImage, X, TerminalSquare } from "lucide-react";
import Button from "@/components/Button";
import { useLanguage } from "@/translations/LanguageContext";
import { useRef, useState } from "react";
import { useCompiler } from "@dashboard/hooks/useCompiler";

export default function CodeEditor({ code, setCode }) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  
  // Estado para UNA sola imagen
  const [evidenceFile, setEvidenceFile] = useState(null);
  
  // Consumimos el hook
  const { logs, isCompiling, compileCode } = useCompiler();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvidenceFile(file);
    }
    // Limpiamos el input para permitir subir el mismo archivo si se borró
    e.target.value = null; 
  };

  const removeEvidence = () => {
    setEvidenceFile(null);
  };

  const handleRunAnalysis = () => {
    compileCode(code, evidenceFile);
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col h-full">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <div>
          <h2 className="font-bold text-slate-800 dark:text-white">
            {t.codeeditor?.analyzer || "Compilador Esteganográfico"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {t.codeeditor?.pasteorwrite || "Escribe tu script StegoScript aquí."}
          </p>
        </div>

        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/png, image/jpeg"
          />
          <Button
            variant="secondary"
            icon={<UploadCloud className="w-4 h-4" />}
            onClick={() => fileInputRef.current.click()}
          >
            {/* Cambia el texto si ya hay un archivo */}
            {evidenceFile ? "Replace Evidence" : "Upload Evidence"}
          </Button>

          <Button
            variant="primary"
            icon={<Play className="w-4 h-4" />}
            onClick={handleRunAnalysis}
            disabled={isCompiling}
          >
            {isCompiling ? "Compiling..." : (t.codeeditor?.runanalysis || "Run Analysis")}
          </Button>
        </div>
      </div>

      {/* EVIDENCE LOCKER (Cola de 1 solo archivo) */}
      {evidenceFile && (
        <div className="flex items-center gap-2 px-5 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-slate-500 font-semibold uppercase">Locker:</span>
          <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1 rounded-md text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <FileImage className="w-3 h-3" />
            <span className="font-medium">{evidenceFile.name}</span>
            {/* Botón de cruz para remover de la queue */}
            <button 
              onClick={removeEvidence} 
              className="ml-1 hover:text-red-500 transition-colors focus:outline-none"
              title="Remove evidence"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* EDITOR */}
      <div className="grid grid-cols-[auto_1fr] bg-[#111827] border-b border-slate-700">
        <div className="py-6 px-4 text-right text-slate-500 select-none font-mono text-sm leading-7 border-r border-white/10">
          {code.split("\n").map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          className="w-full h-full min-h-[340px] bg-[#111827] text-slate-200 p-6 font-mono text-sm leading-7 outline-none resize-none"
        />
      </div>

      {/* TERMINAL EMULATOR */}
      <div className="bg-[#0D1117] min-h-[160px] max-h-[200px] overflow-y-auto p-4 font-mono text-sm">
        <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-800 pb-2">
          <TerminalSquare className="w-4 h-4" />
          <span className="uppercase text-xs font-bold tracking-wider">Output Console</span>
        </div>
        
        <div className="space-y-1">
          {logs.length === 0 ? (
            <span className="text-slate-600 italic">Esperando ejecución...</span>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <span className="text-slate-500 select-none">[{log.time}]</span>
                <span className={`
                  ${log.type === 'error' ? 'text-red-400' : ''}
                  ${log.type === 'success' ? 'text-emerald-400' : ''}
                  ${log.type === 'info' ? 'text-blue-300' : ''}
                `}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}