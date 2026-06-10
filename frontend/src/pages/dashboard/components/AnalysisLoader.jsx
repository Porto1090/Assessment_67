import { Loader2 } from "lucide-react";

export default function AnalysisLoader({ mode, progress, message }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center max-w-xl mx-auto">
      <Loader2 className="w-14 h-14 text-blue-600 animate-spin mx-auto mb-8" />

      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        Analyzing Your {mode === "image" ? "Image" : "Code"}
      </h2>

      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden mb-3">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm font-medium mb-4 text-slate-500 dark:text-slate-300">
        {progress}%
      </p>

      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}