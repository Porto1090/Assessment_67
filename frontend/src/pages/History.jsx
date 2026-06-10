import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/translations/LanguageContext";
import { useTheme } from "@/theme/ThemeContext";
import { useAuthContext } from "@/context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function History() {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuthContext();

  const isDark = theme === "dark";

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga inicial de la BD
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterModel, setFilterModel] = useState("all");

  useEffect(() => {
    async function fetchHistorial() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/history/${user?.username}`);
        
        if (!response.ok) {
          throw new Error("No se pudo obtener el historial de la base de datos.");
        }
        
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error conectando con la API:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistorial();
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.algoritmo_encriptado.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tipo_operacion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "detected" && item.estado === "Detectado") ||
      (filterStatus === "not-detected" && item.estado === "No Detectado");

    const matchesModel =
      filterModel === "all" ||
      item.model === filterModel || // Por compatibilidad si existían previos
      (filterModel === "CNN" && item.algoritmo_encriptado.includes("StegoCNN"));

    return matchesSearch && matchesStatus && matchesModel;
  });

  // FORMATO DE FECHA (Maneja la propiedad 'timestamp' que regresa el backend)
  const formatDate = (dateString) => {
    if (!dateString) return "";
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
            {t.history.title}
          </h1>
          <p className={`text-base ${bodyText}`}>
            {t.history.subtitle}
          </p>
        </div>

        {/* Bloque de Filtros */}
        <div
          className={`rounded-xl shadow-sm p-6 mb-6 border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-transparent"
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
                  placeholder="Buscar por algoritmo o tipo de operación..."
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
                <option value="all">{t.history.allStatus}</option>
                <option value="detected">{t.history.detected}</option>
                <option value="not-detected">{t.history.notDetected}</option>
              </select>
            </div>

            <div>
              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className={inputClass}
              >
                <option value="all">{t.history.allModels}</option>
                <option value="CNN">StegoCNN v3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Renderizado Condicional: Estado de carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-24 text-slate-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-cyan-500" />
            <p className="font-medium">Cargando auditoría desde MongoDB...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div
            className={`rounded-xl shadow-sm p-12 text-center border ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-transparent"
            }`}
          >
            <div className="flex justify-center mb-4">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full ${
                  isDark ? "bg-slate-900" : "bg-slate-50"
                }`}
              >
                <Filter className={`w-8 h-8 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
              </div>
            </div>
            <h3 className={`mb-2 text-xl font-semibold ${titleText}`}>
              {history.length === 0 ? t.history.noHistory : t.history.noResults}
            </h3>
            <p className={`text-sm ${bodyText}`}>
              {history.length === 0 ? t.history.emptyHistory : t.history.emptyResults}
            </p>
          </div>
        ) : (
          <div
            className={`rounded-xl shadow-sm overflow-hidden border ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-transparent"
            }`}
          >
            <table className="w-full">
              <thead className={softBg}>
                <tr>
                  <th className={`px-6 py-4 text-left ${headerText}`}>{t.history.date}</th>
                  <th className={`px-6 py-4 text-left ${headerText}`}>Operación</th>
                  <th className={`px-6 py-4 text-left ${headerText}`}>Algoritmo / Path</th>
                  <th className={`px-6 py-4 text-left ${headerText}`}>{t.history.status}</th>
                  <th className={`px-6 py-4 text-left ${headerText}`}>{t.history.confidence}</th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id_registro} className={`border-t ${border}`}>
                    {/* 1. Timestamp */}
                    <td className={`px-6 py-4 ${mediumText}`}>
                      {formatDate(item.timestamp)}
                    </td>

                    {/* 2. Tipo Operación (ENCODEAR / DECODEAR) */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        item.tipo_operacion === "ENCODEAR" 
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" 
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                      }`}>
                        {item.tipo_operacion}
                      </span>
                    </td>

                    {/* 3. Algoritmo y Path guardado */}
                    <td className={`px-6 py-4 font-medium max-w-xs truncate ${titleText}`}>
                      <div>{item.algoritmo_encriptado}</div>
                      <div className="text-xs font-normal text-slate-400 mt-0.5">{item.image_path}</div>
                    </td>

                    {/* 4. Estado (Detectado / No Detectado) */}
                    <td className="px-6 py-4">
                      {item.estado === "Detectado" ? (
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          {t.history.detected}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600 font-medium">
                          <XCircle className="w-4 h-4" />
                          {t.history.notDetected}
                        </div>
                      )}
                    </td>

                    {/* 5. Confianza (Multiplicada por 100 si viene como decimal de la BD, ej: 0.9997 -> 99.97%) */}
                    <td className={`px-6 py-4 ${mediumText}`}>
                      {item.confianza <= 1 ? (item.confianza * 100).toFixed(2) : item.confianza}%
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
              {t.history.showing} {filteredHistory.length} {t.history.of}{" "}
              {history.length} {t.history.results}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}