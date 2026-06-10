import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import { useLanguage } from "@/translations/LanguageContext";

export default function History() {
  const { language } = useLanguage();

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

  return (
    <div
      className="min-h-[calc(100vh-64px)] py-12"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1
            className="mb-2"
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#1E293B",
            }}
          >
            {t.title}
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#64748B",
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#64748B" }}
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border outline-none"
                  style={{
                    borderColor: "#E2E8F0",
                    backgroundColor: "#F8FAFC",
                  }}
                />
              </div>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border outline-none"
                style={{
                  borderColor: "#E2E8F0",
                  backgroundColor: "#F8FAFC",
                }}
              >
                <option value="all">{t.allStatus}</option>
                <option value="detected">{t.detected}</option>
                <option value="not-detected">
                  {t.notDetected}
                </option>
              </select>
            </div>

            <div>
              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border outline-none"
                style={{
                  borderColor: "#E2E8F0",
                  backgroundColor: "#F8FAFC",
                }}
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
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-full"
                style={{
                  backgroundColor: "#F8FAFC",
                }}
              >
                <Filter
                  className="w-8 h-8"
                  style={{ color: "#64748B" }}
                />
              </div>
            </div>

            <h3
              className="mb-2"
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#1E293B",
              }}
            >
              {history.length === 0 ? t.noHistory : t.noResults}
            </h3>

            <p
              style={{
                fontSize: "14px",
                color: "#64748B",
              }}
            >
              {history.length === 0 ? t.emptyHistory : t.emptyResults}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead
                style={{
                  backgroundColor: "#F8FAFC",
                }}
              >
                <tr>
                  <th className="px-6 py-4 text-left">
                    {t.date}
                  </th>
                  <th className="px-6 py-4 text-left">
                    {t.image}
                  </th>
                  <th className="px-6 py-4 text-left">
                    {t.model}
                  </th>
                  <th className="px-6 py-4 text-left">
                    {t.status}
                  </th>
                  <th className="px-6 py-4 text-left">
                    {t.confidence}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-6 py-4">
                      {formatDate(item.date)}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {item.fileName}
                    </td>

                    <td className="px-6 py-4">
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

                    <td className="px-6 py-4">
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
            <p
              style={{
                fontSize: "14px",
                color: "#64748B",
              }}
            >
              {t.showing} {filteredHistory.length} {t.of}{" "}
              {history.length} {t.results}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}