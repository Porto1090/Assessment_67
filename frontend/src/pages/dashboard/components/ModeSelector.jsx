import { Upload, Code2 } from "lucide-react";
import { useLanguage } from "@/translations/LanguageContext";

export default function ModeSelector({ mode, changeMode }) {
  const { t } = useLanguage();

  return (
    <div className="max-w-xl mx-auto mb-6">
      <div className="grid grid-cols-2 gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <button
          type="button"
          onClick={() => changeMode("image")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            mode === "image"
              ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          }`}
        >
          <Upload className="w-5 h-5" />
          {t.modelselector.uploadimage}
        </button>

        <button
          type="button"
          onClick={() => changeMode("code")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            mode === "code"
              ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          }`}
        >
          <Code2 className="w-5 h-5" />
          {t.modelselector.writecode}
        </button>
      </div>
    </div>
  );
}