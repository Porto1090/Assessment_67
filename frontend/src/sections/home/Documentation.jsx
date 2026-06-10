import { useEffect, useState } from "react";
import { useLanguage } from "@/translations/LanguageContext";

export default function Documentation() {
  const { t, language } = useLanguage();
  const [active, setActive] = useState("home");

  const sections = [
    {
      title: t.documentationSections,
      items: [
        {
          id: "whatsNew",
          name: t.whatsNew,
          description: t.whatsNewDescription,
          content: t.whatsNewContent,
        },
        {
          id: "tutorial",
          name: t.tutorial,
          description: t.tutorialDescription,
          content: t.tutorialContent,
        },
      ],
    },
    {
      title: t.referenceGuide,
      items: [
        {
          id: "globalIndex",
          name: t.globalIndex,
          description: t.globalIndexDescription,
          content: t.globalIndexContent,
        },
        {
          id: "glossary",
          name: t.glossary,
          description: t.glossaryDescription,
          content: t.glossaryContent,
        },
      ],
    },
    {
      title: t.projectInformation,
      items: [
        {
          id: "reportingIssues",
          name: t.reportingIssues,
          description: t.reportingIssuesDescription,
          content: t.reportingIssuesContent,
        },
        {
          id: "projectRepository",
          name: t.projectRepository,
          description: t.projectRepositoryDescription,
          content: t.projectRepositoryContent,
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

  useEffect(() => {
    console.log("Current documentation page:", active);
  }, [active]);

  useEffect(() => {
    setActive("home");
  }, [language]);

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          {t.documentationTitle}
        </h2>

        <p className="mt-4 text-base leading-7 text-slate-500">
          {t.documentationSubtitle}
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {active === "home" && (
          <div className="space-y-8">
            {sections.map((section, sectionIndex) => (
              <section
                key={section.title}
                className={
                  sectionIndex !== 0
                    ? "border-t border-slate-200 pt-8"
                    : ""
                }
              >
                <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-500">
                  {section.title}
                </h3>

                <div className="space-y-4">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActive(item.id)}
                      className="block w-full rounded-xl px-4 py-4 text-left transition hover:bg-blue-50"
                    >
                      <div className="text-lg font-bold text-blue-600">
                        {item.name}
                      </div>

                      <div className="mt-2 text-base leading-6 text-slate-500">
                        {item.description}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {active !== "home" && current && (
          <div>
            <button
              type="button"
              onClick={() => setActive("home")}
              className="mb-6 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              {t.backToDocumentation}
            </button>

            <h3 className="text-2xl font-bold text-slate-800">
              {current.name}
            </h3>

            <p className="mt-3 text-base leading-7 text-slate-500">
              {current.description}
            </p>

            <div className="mt-8 rounded-xl bg-slate-50 p-5">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-slate-600">
                {current.content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}