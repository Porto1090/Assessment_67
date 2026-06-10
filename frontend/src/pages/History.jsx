import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import { useLanguage } from "@/translations/LanguageContext";
import { useTheme } from "@/theme/ThemeContext";

export default function History() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const t = {
    en: {
      title: "Analysis History",
      subtitle: "View all your previous image and code analysis results",
      searchPlaceholder: "Search by file name...",
      allStatus: "All Status",
      detected: "Detected",
      notDetected: "Not Detected",
      allModels: "All Models",
      noHistory: "No Analysis History",
      noResults: "No Results Found",
      emptyHistory: "Start analyzing images or code to see your history here",
      emptyResults: "Try adjusting your filters or search query",
      date: "DATE",
      image: "IMAGE",
      model: "MODEL",
      status: "STATUS",
      confidence: "CONFIDENCE",
      showing: "Showing",
      of: "of",
      results: "results",
    },

    es: {
      title: "Historial de Análisis",
      subtitle: "Consulta todos tus análisis anteriores de imágenes y código",
      searchPlaceholder: "Buscar por nombre de archivo...",
      allStatus: "Todos los estados",
      detected: "Detectado",
      notDetected: "No Detectado",
      allModels: "Todos los modelos",
      noHistory: "No hay historial de análisis",
      noResults: "No se encontraron resultados",
      emptyHistory:
        "Comienza analizando imágenes o código para ver tu historial aquí",
      emptyResults: "Intenta ajustar tus filtros o búsqueda",
      date: "FECHA",
      image: "IMAGEN",
      model: "MODELO",
      status: "ESTADO",
      confidence: "CONFIANZA",
      showing: "Mostrando",
      of: "de",
      results: "resultados",
    },
  }[language];

  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterModel, setFilterModel] = useState("all");

  useEffect(() => {
    const savedHistory = localStorage.getItem("analysisHistory");

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "detected" && item.detected) ||
      (filterStatus === "not-detected" && !item.detected);

    const matchesModel =
      filterModel === "all" ||
      item.model === filterModel;

    return matchesSearch && matchesStatus && matchesModel;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString(language === "es" ? "es-MX" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pageBg = isDark ? "bg-slate-900" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const softBg = isDark ? "bg-slate-900" : "bg-slate-50";
  const titleText = isDark ? "text-white" : "text-slate-800";
  const bodyText = isDark ? "text-slate-300" : "text-slate-500";
  const mediumText = isDark ? "text-slate-300" : "text-slate-700";
  const headerText = isDark ? "text-slate-300" : "text-slate-600";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const inputClass = `w-full px-4 py-3 rounded-lg border outline-none ${
    isDark
      ? "border-slate-700 bg-slate-900 text-white"
      : "border-slate-200 bg-slate-50 text-slate-800"
  }`;

  return (
    <div className={`min-h-[calc(100vh-64px)] py-12 ${pageBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className={`mb-2 text-4xl font-bold ${titleText}`}>
            {t.title}
          </h1>

          <p className={`text-base ${bodyText}`}>
            {t.subtitle}
          </p>
        </div>

        <div
          className={`rounded-xl shadow-sm p-6 mb-6 border ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-transparent"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border outline-none placeholder:text-slate-400 ${
                    isDark
                      ? "border-slate-700 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-800"
                  }`}
                />
              </div>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={inputClass}
              >
                <option value="all">{t.allStatus}</option>
                <option value="detected">{t.detected}</option>
                <option value="not-detected">{t.notDetected}</option>
              </select>
            </div>

            <div>
              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className={inputClass}
              >
                <option value="all">{t.allModels}</option>
                <option value="CNN">CNN</option>
                <option value="SVM">SVM</option>
                <option value="Code Analyzer">Code Analyzer</option>
              </select>
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div
            className={`rounded-xl shadow-sm p-12 text-center border ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-transparent"
            }`}
          >
            <div className="flex justify-center mb-4">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full ${
                  isDark ? "bg-slate-900" : "bg-slate-50"
                }`}
              >
                <Filter
                  className={`w-8 h-8 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                />
              </div>
            </div>

            <h3 className={`mb-2 text-xl font-semibold ${titleText}`}>
              {history.length === 0 ? t.noHistory : t.noResults}
            </h3>

            <p className={`text-sm ${bodyText}`}>
              {history.length === 0 ? t.emptyHistory : t.emptyResults}
            </p>
          </div>
        ) : (
          <div
            className={`rounded-xl shadow-sm overflow-hidden border ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-transparent"
            }`}
          >
            <table className="w-full">
              <thead className={softBg}>
                <tr>
                  <th className={`px-6 py-4 text-left ${headerText}`}>
                    {t.date}
                  </th>
                  <th className={`px-6 py-4 text-left ${headerText}`}>
                    {t.image}
                  </th>
                  <th className={`px-6 py-4 text-left ${headerText}`}>
                    {t.model}
                  </th>
                  <th className={`px-6 py-4 text-left ${headerText}`}>
                    {t.status}
                  </th>
                  <th className={`px-6 py-4 text-left ${headerText}`}>
                    {t.confidence}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-t ${border}`}
                  >
                    <td className={`px-6 py-4 ${mediumText}`}>
                      {formatDate(item.date)}
                    </td>

                    <td className={`px-6 py-4 font-medium ${titleText}`}>
                      {item.fileName}
                    </td>

                    <td className={`px-6 py-4 ${mediumText}`}>
                      {item.model}
                    </td>

                    <td className="px-6 py-4">
                      {item.detected ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          {t.detected}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-4 h-4" />
                          {t.notDetected}
                        </div>
                      )}
                    </td>

                    <td className={`px-6 py-4 ${mediumText}`}>
                      {item.confidence}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredHistory.length > 0 && (
          <div className="mt-6">
            <p className={`text-sm ${bodyText}`}>
              {t.showing} {filteredHistory.length} {t.of}{" "}
              {history.length} {t.results}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}