import { useLanguage } from "@/translations/LanguageContext";

import Documentation from "@dashboard/components/Documentation";
import ModeSelector from "@dashboard/components/ModeSelector";
import ImageUploader from "@dashboard/components/ImageUploader";
import CodeEditor from "@dashboard/components/CodeEditor";
import AnalysisLoader from "@dashboard/components/AnalysisLoader";
import AnalysisResults from "@dashboard/components/AnalysisResults";
import ActionSelector from "@dashboard/components/ActionSelector";

import { useDashboardAnalysis } from "@dashboard/hooks/useDashboardAnalysis";

export default function Dashboard() {
  const { t } = useLanguage();
  
  const analysis = useDashboardAnalysis(); 

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white dark:bg-slate-900 transition-colors">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] min-h-[calc(100vh-64px)]">
        <section className="px-6 sm:px-10 lg:px-16 py-12">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-4">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2 text-slate-800 dark:text-white">
                {t.dashboard.title}
              </h1>
              <p className="text-md max-w-3xl mx-auto text-slate-500 dark:text-slate-300">
                {t.dashboard.subtitle}
              </p>
            </div>

            <ModeSelector mode={analysis.mode} changeMode={analysis.changeMode} />

            {analysis.stage === "idle" && analysis.mode === "image" && (
              <>
                <ActionSelector action={analysis.imageAction} setAction={analysis.setImageAction} />
                <ImageUploader 
                  fileInputRef={analysis.fileInputRef} 
                  analyzeImage={analysis.analyzeImage} 
                />
              </>
            )}

            {analysis.stage === "idle" && analysis.mode === "code" && (
              <CodeEditor 
                code={analysis.code} 
                setCode={analysis.setCode} 
                runAnalysis={analysis.runCodeAnalysis} 
              />
            )}

            {analysis.stage === "loading" && (
              <AnalysisLoader 
                mode={analysis.mode} 
                progress={analysis.progress} 
                message={analysis.loadingMessage} 
              />
            )}

            {analysis.stage === "done" && analysis.result && (
              <AnalysisResults 
                result={analysis.result} 
                resetAnalysis={analysis.resetAnalysis} 
                downloadResults={analysis.downloadResults} 
              />
            )}

          </div>
        </section>

        <aside className="border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-6 overflow-y-auto">
          <Documentation />
        </aside>
      </div>
    </main>
  );
}