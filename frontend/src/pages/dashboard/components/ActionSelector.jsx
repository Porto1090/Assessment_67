import { Lock, Unlock } from "lucide-react";
import { useLanguage } from "@/translations/LanguageContext";

export default function ActionSelector({ action, setAction }) {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto mb-6">
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
        <button
          type="button"
          onClick={() => setAction("encode")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
            action === "encode"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
          }`}
        >
          <Lock className="w-4 h-4" />
          {t.actionselector.encode} 
        </button>

        <button
          type="button"
          onClick={() => setAction("decode")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
            action === "decode"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
          }`}
        >
          <Unlock className="w-4 h-4" />
          {t.actionselector.decode}
        </button>
      </div>
    </div>
  );
}