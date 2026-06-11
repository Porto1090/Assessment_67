import { Play } from "lucide-react";
import Button from "@/components/Button";
import { useLanguage } from "@/translations/LanguageContext";

export default function CodeEditor({ code, setCode, runAnalysis }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <div>
          <h2 className="font-bold text-slate-800 dark:text-white">
            {t.codeeditor.analyzer}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {t.codeeditor.pasteorwrite}
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Play className="w-4 h-4" />}
          onClick={runAnalysis}
        >
          {t.codeeditor.runanalysis}
        </Button>
      </div>

      <div className="grid grid-cols-[auto_1fr] bg-[#111827]">
        <div className="py-6 px-4 text-right text-slate-500 select-none font-mono text-sm leading-7 border-r border-white/10">
          {code.split("\n").map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          className="w-full min-h-[460px] bg-[#111827] text-slate-200 p-6 font-mono text-sm leading-7 outline-none resize-none"
        />
      </div>
    </div>
  );
}