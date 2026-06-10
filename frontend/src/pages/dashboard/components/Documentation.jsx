import { useState } from "react";
import { useLanguage } from "@/translations/LanguageContext";
import { useTheme } from "@/theme/ThemeContext";
import { ArrowLeft, BookOpen, ChevronRight, FileText } from "lucide-react";

export default function Documentation() {
  const { t } = useLanguage();
  const [active, setActive] = useState("home");

  const sections = [
    {
      title: t.docs.categories.sections,
      items: [
        {
          id: "whatsNew",
          name: t.docs.articles.whatsNew.name,
          description: t.docs.articles.whatsNew.description,
          content: t.docs.articles.whatsNew.content,
        },
        {
          id: "tutorial",
          name: t.docs.articles.tutorial.name,
          description: t.docs.articles.tutorial.description,
          content: t.docs.articles.tutorial.content,
        },
      ],
    },
    {
      title: t.docs.categories.reference,
      items: [
        {
          id: "globalIndex",
          name: t.docs.articles.globalIndex.name,
          description: t.docs.articles.globalIndex.description,
          content: t.docs.articles.globalIndex.content,
        },
        {
          id: "glossary",
          name: t.docs.articles.glossary.name,
          description: t.docs.articles.glossary.description,
          content: t.docs.articles.glossary.content,
        },
      ],
    },
    {
      title: t.docs.categories.project,
      items: [
        {
          id: "reportingIssues",
          name: t.docs.articles.reportingIssues.name,
          description: t.docs.articles.reportingIssues.description,
          content: t.docs.articles.reportingIssues.content,
        },
        {
          id: "projectRepository",
          name: t.docs.articles.projectRepository.name,
          description: t.docs.articles.projectRepository.description,
          content: t.docs.articles.projectRepository.content,
        },
      ],
    },
  ];

  const docs = sections.reduce((acc, section) => {
    section.items.forEach((item) => {
      acc[item.id] = item;
    });
    return acc;
  }, {});

  const current = docs[active];

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Docs</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          {t.documentationTitle}
        </h2>
        <p className="mt-2 text-sm lg:text-base leading-relaxed text-slate-500 dark:text-slate-400">
          {t.documentationSubtitle}
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 lg:p-6 shadow-inner">
        
        {/* VISTA HOME: Lista de Secciones y Artículos */}
        {active === "home" && (
          <div className="space-y-8">
            {sections.map((section, sectionIndex) => (
              <section key={section.title} className={sectionIndex !== 0 ? "border-t border-slate-200 dark:border-slate-800 pt-6" : ""}>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {section.title}
                </h3>

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActive(item.id)}
                      className="group flex w-full items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 text-left shadow-sm transition-all hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:shadow-md"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                          {item.name}
                        </div>
                        <p className="text-xs lg:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5 shrink-0 mt-0.5" />
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {active !== "home" && current && (
          <div className="animate-fade-in">
            <button
              type="button"
              onClick={() => setActive("home")}
              className="group mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              {t.backToDocumentation || "Back to Documentation"}
            </button>

            <article className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                {current.name}
              </h3>
              
              <p className="text-sm lg:text-base leading-relaxed text-slate-600 dark:text-slate-300 border-l-2 border-blue-500 pl-3 bg-blue-50/30 dark:bg-blue-500/5 py-1 rounded-r-md">
                {current.description}
              </p>

              <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <pre className="whitespace-pre-wrap font-mono text-xs lg:text-sm leading-relaxed text-slate-700 dark:text-slate-300 selection:bg-blue-500/20">
                  {current.content}
                </pre>
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}