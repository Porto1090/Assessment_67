import { Upload, FileImage, CheckCircle2 } from "lucide-react";
import Button from "@/components/Button";
import { useLanguage } from "@/translations/LanguageContext";

export default function ImageUploader({ fileInputRef, analyzeImage }) {
  const { t } = useLanguage();

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    analyzeImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    analyzeImage(file);
  };

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
        {t.imageuploader.title}
      </h2>

      <p className="text-slate-500 dark:text-slate-300 mb-8">
        {t.imageuploader.subtitle}
      </p>

      <Button
        variant="primary"
        icon={<FileImage className="w-5 h-5" />}
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        {t.imageuploader.selectfile}
      </Button>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-slate-500 dark:text-slate-300">{t.imageuploader.png}</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-slate-500 dark:text-slate-300">{t.imageuploader.maxsize}</span>
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