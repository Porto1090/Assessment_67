import { CheckCircle2, XCircle, Download, Upload, Home } from "lucide-react";
import Button from "@/components/Button";

export default function AnalysisResults({ result, resetAnalysis, downloadResults }) {
  if (!result) return null;

  if (result.detected) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            {result.type === "image" ? "Encrypted Message Detected" : "Hidden Logic Detected"}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold mb-4 text-slate-800 dark:text-white">
            {result.type === "image" ? "Recovered Message" : "Detection Explanation"}
          </h3>
          <div className="border-2 border-cyan-400 bg-slate-50 dark:bg-slate-900 rounded-xl p-6 leading-7 text-slate-700 dark:text-slate-200">
            "{result.message || result.explanation}"
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5">
            <p className="text-sm mb-2 text-slate-500 dark:text-slate-300">Model Used</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{result.model}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5">
            <p className="text-sm mb-2 text-slate-500 dark:text-slate-300">Confidence Score</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${result.confidence}%` }} />
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{result.confidence}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5">
            <p className="text-sm mb-2 text-slate-500 dark:text-slate-300">Analysis Timestamp</p>
            <p className="font-medium text-slate-800 dark:text-white">{result.timestamp}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5">
            <p className="text-sm mb-2 text-slate-500 dark:text-slate-300">Processing Duration</p>
            <p className="font-medium text-slate-800 dark:text-white">{result.duration}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" fullWidth icon={<Download className="w-5 h-5" />} onClick={downloadResults}>
            Download Results
          </Button>
          <Button variant="outline" fullWidth icon={<Upload className="w-5 h-5" />} onClick={resetAnalysis}>
            {result.type === "image" ? "Analyze Another Image" : "Analyze Another Code"}
          </Button>
        </div>
      </div>
    );
  }

  // Estado: No detectado
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400">
          <XCircle className="w-5 h-5" />
          No Hidden Message Detected
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Possible Reasons</h3>
        <div className="space-y-3">
          {result.reasons.map((reason, index) => (
            <div key={index} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-lg p-5 text-slate-500 dark:text-slate-300">
              <span>•</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5">
          <p className="text-sm mb-2 text-slate-500 dark:text-slate-300">Model Used</p>
          <p className="font-bold text-slate-800 dark:text-white">{result.model}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5">
          <p className="text-sm mb-2 text-slate-500 dark:text-slate-300">Confidence</p>
          <p className="font-bold text-slate-800 dark:text-white">{result.confidence}%</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5">
          <p className="text-sm mb-2 text-slate-500 dark:text-slate-300">Duration</p>
          <p className="font-bold text-slate-800 dark:text-white">{result.duration}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="primary" fullWidth icon={<Upload className="w-5 h-5" />} onClick={resetAnalysis}>
          {result.type === "image" ? "Upload New Image" : "Analyze New Code"}
        </Button>
        <Button variant="outline" fullWidth icon={<Home className="w-5 h-5" />} onClick={resetAnalysis}>
          Return Home
        </Button>
      </div>
    </div>
  );
}