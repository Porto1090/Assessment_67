import { FileImage, Brain, HelpCircle, Shield } from "lucide-react";
import { useLanguage } from "@/translations/LanguageContext";
import { useTheme } from "@/theme/ThemeContext";

export default function Help() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const pageBg = isDark ? "bg-slate-900" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const softBg = isDark ? "bg-slate-900" : "bg-slate-50";
  const iconBg = isDark ? "bg-blue-500/10" : "bg-blue-50";
  const titleText = isDark ? "text-white" : "text-slate-800";
  const bodyText = isDark ? "text-slate-300" : "text-slate-500";
  const mediumText = isDark ? "text-slate-300" : "text-slate-700";
  const border = isDark ? "border-slate-700" : "border-transparent";

  const cardClass = `${cardBg} rounded-xl shadow-sm p-8 mb-6 border ${border}`;
  const iconBoxClass = `flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0 ${iconBg}`;
  const smallCardClass = `p-4 rounded-lg ${softBg}`;

  return (
    <div className={`min-h-[calc(100vh-64px)] py-12 ${pageBg}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="text-center mb-12">
          <h1 className={`mb-3 text-4xl font-bold ${titleText}`}>
            {t.help.title}
          </h1>
          <p className={`text-base ${bodyText}`}>
            {t.help.subtitle}
          </p>
        </div>

        {/* Sección: Cómo Funciona */}
        <div className={cardClass}>
          <div className="flex items-start gap-4 mb-4">
            <div className={iconBoxClass}>
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className={`mb-2 text-2xl font-bold ${titleText}`}>
                {t.help.howItWorks}
              </h2>
              <p className={`text-sm leading-6 ${bodyText}`}>
                {t.help.howItWorksText}
              </p>
            </div>
          </div>

          <div className="space-y-4 ml-16">
            {[
              [t.help.steps.uploadTitle, t.help.steps.uploadText],
              [t.help.steps.aiTitle, t.help.steps.aiText],
              [t.help.steps.extractionTitle, t.help.steps.extractionText],
              [t.help.steps.resultsTitle, t.help.steps.resultsText],
            ].map(([title, text]) => (
              <div key={title} className={smallCardClass}>
                <h3 className={`mb-2 text-base font-semibold ${titleText}`}>
                  {title}
                </h3>
                <p className={`text-sm ${bodyText}`}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección: Formatos Soportados */}
        <div className={cardClass}>
          <div className="flex items-start gap-4 mb-4">
            <div className={iconBoxClass}>
              <FileImage className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className={`mb-2 text-2xl font-bold ${titleText}`}>
                {t.help.formats.title}
              </h2>
              <p className={`text-sm ${bodyText}`}>
                {t.help.formats.text}
              </p>
            </div>
          </div>

          <div className={`space-y-4 ml-16 ${mediumText}`}>
            <p>
              <strong className={titleText}>{t.help.formats.labelFormat}</strong>{" "}
              JPG / JPEG / PNG
            </p>
            <p>
              <strong className={titleText}>{t.help.formats.labelSize}</strong>{" "}
              10 MB
            </p>
            <p>
              <strong className={titleText}>{t.help.formats.labelResolution}</strong>{" "}
              800x600+
            </p>
            <p>
              <strong className={titleText}>{t.help.formats.labelQuality}</strong>{" "}
              {t.help.formats.qualityText}
            </p>
          </div>
        </div>

        {/* Sección: FAQ */}
        <div className={cardClass}>
          <div className="flex items-start gap-4 mb-6">
            <div className={iconBoxClass}>
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className={`text-2xl font-bold ${titleText}`}>
              {t.help.faq.title}
            </h2>
          </div>

          <div className="space-y-6 ml-16">
            {[
              [t.help.faq.q1, t.help.faq.a1],
              [t.help.faq.q2, t.help.faq.a2],
              [t.help.faq.q3, t.help.faq.a3],
              [t.help.faq.q4, t.help.faq.a4],
              [t.help.faq.q5, t.help.faq.a5],
            ].map(([question, answer]) => (
              <div key={question}>
                <h3 className={`font-semibold mb-2 ${titleText}`}>
                  {question}
                </h3>
                <p className={bodyText}>
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Banner de Seguridad */}
        <div
          className={`mt-8 p-6 rounded-xl border border-blue-500 ${
            isDark ? "bg-blue-500/10" : "bg-blue-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 flex-shrink-0 text-blue-600" />
            <div>
              <h3 className={`mb-2 text-base font-semibold ${titleText}`}>
                {t.help.security.title}
              </h3>
              <p className={`text-sm leading-6 ${bodyText}`}>
                {t.help.security.text}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}