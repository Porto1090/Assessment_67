import { Upload, FileImage, CheckCircle2, ChevronRight, X } from "lucide-react";
import Button from "@/components/Button";
import { useLanguage } from "@/translations/LanguageContext";
import { useState, useEffect } from "react";

export default function ImageUploader({ fileInputRef, analyzeImage, imageAction }) {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [algorithm, setAlgorithm] = useState("lsb");

  // Al alternar la acción global en el dashboard, reseteamos estados del contenedor
  useEffect(() => {
    setSelectedFile(null);
    setMessage("");
    setAlgorithm("lsb");
  }, [imageAction]);

  const handleProcessFile = (file) => {
    if (!file) return;
    if (imageAction === "decode") {
      // En modo Decode se dispara directamente
      analyzeImage(file);
    } else {
      // En modo Encode guardamos temporalmente el archivo local para renderizar el formulario
      setSelectedFile(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    handleProcessFile(file);
    e.target.value = null; // Limpieza del buffer del input
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleProcessFile(file);
  };

  const handleSubmitEncode = (e) => {
    e.preventDefault();
    if (!selectedFile || !message.trim()) {
      alert("Por favor ingresa un mensaje válido para incrustar.");
      return;
    }
    analyzeImage(selectedFile, message, algorithm);
  };

  const handleCancelEncode = () => {
    setSelectedFile(null);
    setMessage("");
    setAlgorithm("lsb");
  };

  // RENDER SECCIÓN FORMULARIO EN EL MISMO ESPACIO (ACCION ENCODE + ARCHIVO CARGADO)
  if (imageAction === "encode" && selectedFile) {
    return (
      <div className="border-2 border-solid border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-md transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
              <FileImage className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 dark:text-white text-md">Configuración de Esteganografía</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-[220px] sm:max-w-md">
                Archivo base: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleCancelEncode}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitEncode} className="space-y-5 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Mensaje Oculto (Secret Payload) *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe el mensaje confidencial que deseas ocultar dentro de los pixeles..."
              className="w-full min-h-[110px] p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Algoritmo de Inserción Esteganográfica *
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="lsb">LSB (Least Significant Bit)</option>
              <option value="dct">DCT (Discrete Cosine Transform)</option>
              <option value="bpcs">BPCS (Bit-Plane Complexity Segmentation)</option>
              <option value="pvd">PVD (Pixel Value Differencing)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <Button variant="secondary" type="button" onClick={handleCancelEncode}>
              Cambiar Imagen
            </Button>
            <Button variant="primary" type="submit" icon={<ChevronRight className="w-4 h-4" />}>
              Ejecutar Codificación
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // RENDER COMPONENTE POR DEFECTO (ZONA DROP / BUSQUEDA INICIAL)
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className="border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl p-12 lg:p-16 text-center cursor-pointer transition-all hover:border-blue-500 dark:hover:border-blue-500"
    >
      <div className="flex justify-center mb-6">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-500/10">
          <Upload className="w-12 h-12 text-blue-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
        {imageAction === "encode" ? "Sube la imagen base (Cover)" : t.imageuploader?.title || "Sube una imagen para Decodificar"}
      </h2>

      <p className="text-slate-500 dark:text-slate-300 mb-8">
        {imageAction === "encode" ? "Una vez cargada, podrás configurar el mensaje y el algoritmo de la lista" : t.imageuploader?.subtitle || "Arrastra tu archivo o búscalo de forma local"}
      </p>

      <Button
        variant="primary"
        icon={<FileImage className="w-5 h-5" />}
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        {t.imageuploader?.selectfile || "Seleccionar Archivo"}
      </Button>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-slate-500 dark:text-slate-300">Formatos: PNG</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-slate-500 dark:text-slate-300">Tamaño máx: 10MB</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}
