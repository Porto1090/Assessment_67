import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  Loader2,
  KeyRound,
  ShieldAlert,
  ShieldCheck
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOperation, setFilterOperation] = useState("all");

  useEffect(() => {
    async function fetchHistorial() {
      try {
        setLoading(true);
        // Consumimos el historial real por usuario
        const response = await fetch(`${API_BASE_URL}/api/history/${user?.username || "anonymous"}`);
        
        if (!response.ok) {
          throw new Error("No se pudo obtener el historial de la base de datos.");
        }
        
        const data = await response.json();
        
        // Ordenamos por fecha de más reciente a más antiguo (opcional, pero buena UX)
        const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setHistory(sortedData);
      } catch (error) {
        console.error("Error conectando con la API:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.username) {
        fetchHistorial();
    } else {
        setLoading(false); // Evita quedarse en loading si no hay usuario
    }
  }, [user]);

  const filteredHistory = history.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      item.algoritmo_encriptado?.toLowerCase().includes(searchLower) ||
      item.image_path?.toLowerCase().includes(searchLower);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "detected" && item.estado === "Detectado") ||
      (filterStatus === "clean" && item.estado === "Limpio") ||
      (filterStatus === "completed" && item.estado === "Completado");

    const matchesOperation =
      filterOperation === "all" ||
      item.tipo_operacion === filterOperation;

    return matchesSearch && matchesStatus && matchesOperation;
  });

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

  // Renderizador semántico del Estado (Badge)
  const renderStatusBadge = (estado) => {
    switch(estado) {
        case "Completado": // Pertenece a la operación ENCODE
            return (
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md w-fit">
                    <KeyRound className="w-4 h-4" />
                    <span className="text-xs">Completado</span>
                </div>
            );
        case "Detectado": // Pertenece a la operación DECODE (Payload Encontrado)
            return (
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-md w-fit">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-xs">{t.history.detected || "Detectado"}</span>
                </div>
            );
        case "Limpio": // Pertenece a la operación DECODE (Cover Image)
            return (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-md w-fit">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs">Cover (Limpio)</span>
                </div>
            );
        default:
            return <span className="text-slate-500">{estado}</span>;
    }
  };

  const pageBg = isDark ? "bg-slate-900" : "bg-slate-50";
  const softBg = isDark ? "bg-slate-900" : "bg-slate-50";
  const titleText = isDark ? "text-white" : "text-slate-800";
  const bodyText = isDark ? "text-slate-300" : "text-slate-500";
  const mediumText = isDark ? "text-slate-300" : "text-slate-700";
  const headerText = isDark ? "text-slate-300" : "text-slate-600";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const inputClass = `w-full px-4 py-3 rounded-lg border outline-none text-sm ${
    isDark
      ? "border-slate-700 bg-slate-900 text-white"
      : "border-slate-200 bg-slate-50 text-slate-800"
  }`;

  return (
    <div className={`min-h-[calc(100vh-64px)] py-12 ${pageBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className={`mb-2 text-4xl font-bold ${titleText}`}>
            {t.history?.title || "Auditoría de IA"}
          </h1>
          <p className={`text-base ${bodyText}`}>
            {t.history?.subtitle || "Historial en tiempo real de codificaciones y detecciones en la base de datos."}
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
                  placeholder="Buscar por algoritmo (LSB) o nombre de archivo..."
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border outline-none placeholder:text-slate-400 text-sm ${
                    isDark
                      ? "border-slate-700 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-800"
                  }`}
                />
              </div>
            </div>

            <div>
              <select
                value={filterOperation}
                onChange={(e) => setFilterOperation(e.target.value)}
                className={inputClass}
              >
                <option value="all">Todas las Operaciones</option>
                <option value="ENCODEAR">Solo Encode (Ocultar)</option>
                <option value="DECODEAR">Solo Decode (Detectar)</option>
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={inputClass}
              >
                <option value="all">Todos los Estados</option>
                <option value="completed">Exitosos (Completado)</option>
                <option value="detected">Positivos IA (Detectado)</option>
                <option value="clean">Negativos IA (Limpio)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Renderizado Condicional: Estado de carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-24 text-slate-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-500" />
            <p className="font-medium text-sm uppercase tracking-widest">Sincronizando con MongoDB...</p>
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
              {history.length === 0 ? (t.history?.noHistory || "No hay registros") : (t.history?.noResults || "Sin coincidencias")}
            </h3>
            <p className={`text-sm ${bodyText}`}>
              {history.length === 0 
                ? (t.history?.emptyHistory || "Aún no has procesado ninguna imagen en el sistema.") 
                : (t.history?.emptyResults || "Ningún resultado coincide con los filtros aplicados.")}
            </p>
          </div>
        ) : (
          <div
            className={`rounded-xl shadow-sm overflow-x-auto border ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-transparent"
            }`}
          >
            <table className="w-full text-sm">
              <thead className={softBg}>
                <tr>
                  <th className={`px-6 py-4 text-left font-bold tracking-wider uppercase text-xs ${headerText}`}>{t.history?.date || "Fecha"}</th>
                  <th className={`px-6 py-4 text-left font-bold tracking-wider uppercase text-xs ${headerText}`}>Operación</th>
                  <th className={`px-6 py-4 text-left font-bold tracking-wider uppercase text-xs ${headerText}`}>Detalles del Activo</th>
                  <th className={`px-6 py-4 text-left font-bold tracking-wider uppercase text-xs ${headerText}`}>{t.history?.status || "Estado IA"}</th>
                  <th className={`px-6 py-4 text-left font-bold tracking-wider uppercase text-xs ${headerText}`}>{t.history?.confidence || "Confianza"}</th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id_registro || Math.random()} className={`border-t transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50 ${border}`}>
                    
                    {/* 1. Timestamp */}
                    <td className={`px-6 py-4 whitespace-nowrap ${mediumText}`}>
                      {formatDate(item.timestamp)}
                    </td>

                    {/* 2. Tipo Operación */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-widest ${
                        item.tipo_operacion === "ENCODEAR" 
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800" 
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                      }`}>
                        {item.tipo_operacion}
                      </span>
                    </td>

                    {/* 3. Detalles (Algoritmo y Path) */}
                    <td className="px-6 py-4">
                      <div className={`font-bold text-sm mb-0.5 ${titleText}`}>
                        {item.algoritmo_encriptado || "Desconocido"}
                      </div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[200px] md:max-w-[300px]">
                        {item.image_path}
                      </div>
                    </td>

                    {/* 4. Estado con Iconos */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(item.estado)}
                    </td>

                    {/* 5. Confianza de IA */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                         {/* Si es ENCODE, siempre es 100%. Si es DECODE, renderizamos la confianza de la IA */}
                         <span className={`font-mono font-medium ${item.confianza >= 0.9 ? "text-emerald-500" : "text-amber-500"}`}>
                            {item.confianza <= 1 ? (item.confianza * 100).toFixed(2) : parseFloat(item.confianza).toFixed(2)}%
                         </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        {filteredHistory.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className={`text-sm ${bodyText}`}>
              Mostrando <span className="font-bold text-slate-700 dark:text-slate-200">{filteredHistory.length}</span> registros.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}