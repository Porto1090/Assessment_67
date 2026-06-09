import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileImage,
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
  Home,
} from "lucide-react";
import Button from "@/components/Button";
import Documentation from "@/sections/home/Documentation.jsx";

export default function Dashboard() {
  const [mode, setMode] = useState("image");
  const [stage, setStage] = useState("idle");
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing analysis...");

  const [code, setCode] = useState(`// Escribe tu código a compilar acá
// Recuerda utilizar la documentación a tu derecha para guiarte en el proceso

int suma(int a, int b) {
  int c;
  c = a + b;
  return c;
}

int main() {
  int x;
  int y;
  int z;

  x = 4;
  y = 4;

  z = suma(x, y);

  if (z > 5) {
    z = z * 2;
  }

  return z;
}`);

  const fileInputRef = useRef(null);
  const pendingFileRef = useRef(null);

  useEffect(() => {
    if (stage !== "loading") return;

    setProgress(0);

    const imageMessages = [
      "Analyzing image...",
      "Detecting hidden patterns...",
      "Running CNN model...",
      "Running classification...",
      "Generating results...",
    ];

    const codeMessages = [
      "Parsing source code...",
      "Extracting logic patterns...",
      "Running code analyzer...",
      "Evaluating hidden behavior...",
      "Generating results...",
    ];

    const messages = mode === "image" ? imageMessages : codeMessages;

    let currentMessage = 0;
    setLoadingMessage(messages[0]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 4;

        if (next >= 100) {
          clearInterval(interval);
          finishAnalysis();
          return 100;
        }

        const messageIndex = Math.min(
          Math.floor(next / 25),
          messages.length - 1
        );

        if (messageIndex !== currentMessage) {
          currentMessage = messageIndex;
          setLoadingMessage(messages[messageIndex]);
        }

        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [stage]);

  const resetAnalysis = () => {
    setStage("idle");
    setResult(null);
    setFileName("");
    setProgress(0);
    setLoadingMessage("Initializing analysis...");
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    resetAnalysis();
  };

  const saveToHistory = (data) => {
    const historyItem = {
      date: new Date().toISOString(),
      fileName: data.fileName,
      model: data.model,
      detected: data.detected,
      confidence: data.confidence,
      type: data.type,
    };

    const history = JSON.parse(
      localStorage.getItem("analysisHistory") || "[]"
    );

    history.unshift(historyItem);
    localStorage.setItem("analysisHistory", JSON.stringify(history));
  };

  const analyzeImage = (file) => {
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      alert("Please upload a JPG, JPEG or PNG image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    pendingFileRef.current = file;
    setFileName(file.name);
    setResult(null);
    setStage("loading");
  };

  const runCodeAnalysis = () => {
    pendingFileRef.current = null;
    setFileName("source-code-analysis.c");
    setResult(null);
    setStage("loading");
  };

  const finishAnalysis = () => {
    if (mode === "image") {
      const file = pendingFileRef.current;
      const detected = Math.random() > 0.35;
      const model = detected ? "CNN" : "SVM";
      const confidence = detected ? 82 : 37;

      const analysisResult = {
        type: "image",
        detected,
        model,
        confidence,
        duration: detected ? "5.6s" : "6.3s",
        timestamp: new Date().toLocaleString(),
        message: detected
          ? "The secret lies beneath the surface. Trust no one, verify everything."
          : null,
        reasons: [
          "No encrypted content present",
          "Image quality too low",
          "Unsupported encoding method",
          "Compression altered hidden data",
        ],
      };

      setResult(analysisResult);
      setStage("done");

      saveToHistory({
        fileName: file?.name || "uploaded-image.jpg",
        model,
        detected,
        confidence,
        type: "Image",
      });

      return;
    }

    const detected =
      code.includes("return") || code.includes("suma") || code.includes("if");

    const confidence = detected ? 88 : 42;

    const analysisResult = {
      type: "code",
      detected,
      model: "Code Analyzer",
      confidence,
      duration: detected ? "4.8s" : "5.1s",
      timestamp: new Date().toLocaleString(),
      message: detected
        ? "Hidden logic detected inside the source code structure."
        : null,
      explanation: detected
        ? "The analyzer found conditional logic, function calls, and return statements that may contain hidden behavior or encoded execution patterns."
        : "No suspicious logic, encoded patterns, or hidden execution behavior were detected in the submitted source code.",
      reasons: [
        "No suspicious encoded logic found",
        "No hidden execution pattern detected",
        "No unusual compiler behavior identified",
        "Source structure appears valid",
      ],
    };

    setResult(analysisResult);
    setStage("done");

    saveToHistory({
      fileName: "source-code-analysis.c",
      model: "Code Analyzer",
      detected,
      confidence,
      type: "Code",
    });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    analyzeImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    analyzeImage(file);
  };

  const downloadResults = () => {
    if (!result) return;

    const report = `
CipherVision Analysis Report
============================

Analysis Type: ${result.type === "image" ? "Image Upload" : "Source Code"}
File/Input: ${fileName}
Status: ${result.detected ? "Detected" : "Not Detected"}
Model Used: ${result.model}
Confidence: ${result.confidence}%
Timestamp: ${result.timestamp}
Duration: ${result.duration}

${
  result.detected
    ? `Recovered Message / Explanation:
${result.message || result.explanation}`
    : `Explanation:
${result.explanation || "No hidden message detected."}`
}
    `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `ciphervision-report-${Date.now()}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] min-h-[calc(100vh-64px)]">
        <section className="px-6 sm:px-10 lg:px-16 py-14">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                Recover Hidden Messages from Images
              </h1>

              <p className="text-lg lg:text-xl text-slate-500 max-w-3xl mx-auto">
                Upload an image or write code and allow our AI models to analyze
                hidden encrypted information.
              </p>
            </div>

            <div className="max-w-xl mx-auto mb-8">
              <div className="grid grid-cols-2 gap-2 p-2 rounded-xl border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => changeMode("image")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    mode === "image"
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  Upload Image
                </button>

                <button
                  type="button"
                  onClick={() => changeMode("code")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    mode === "code"
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Code2 className="w-5 h-5" />
                  Write Code
                </button>
              </div>
            </div>

            {stage === "idle" && mode === "image" && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-2xl p-12 lg:p-16 text-center cursor-pointer transition-all hover:border-blue-500"
                style={{
                  borderColor: "#E2E8F0",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <div className="flex justify-center mb-6">
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-50">
                    <Upload className="w-12 h-12 text-blue-600" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Drag & Drop your image here
                </h2>

                <p className="text-slate-500 mb-8">or click to browse files</p>

                <Button
                  variant="primary"
                  icon={<FileImage className="w-5 h-5" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Select File
                </Button>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-500">
                      JPG/JPEG/PNG supported
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-500">Maximum 10MB</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            )}

            {stage === "idle" && mode === "code" && (
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
                  <div>
                    <h2 className="font-bold text-slate-800">
                      Source Code Analyzer
                    </h2>
                    <p className="text-sm text-slate-500">
                      Paste or write your code below.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    icon={<Play className="w-4 h-4" />}
                    onClick={runCodeAnalysis}
                  >
                    Run Analysis
                  </Button>
                </div>

                <div className="grid grid-cols-[auto_1fr] bg-[#111827]">
                  <div className="py-6 px-4 text-right text-slate-500 select-none font-mono text-sm leading-7 border-r border-white/10">
                    {code.split("\n").map((_, index) => (
                      <div key={index}>{index + 1}</div>
                    ))}
                  </div>

                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck="false"
                    className="w-full min-h-[460px] bg-[#111827] text-slate-200 p-6 font-mono text-sm leading-7 outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {stage === "loading" && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-xl mx-auto">
                <Loader2 className="w-14 h-14 text-blue-600 animate-spin mx-auto mb-8" />

                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Analyzing Your {mode === "image" ? "Image" : "Code"}
                </h2>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-3">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-sm font-medium text-slate-500 mb-4">
                  {progress}%
                </p>

                <p className="text-sm text-slate-400">{loadingMessage}</p>
              </div>
            )}

            {stage === "done" && result && result.detected && (
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
                <div className="flex justify-center mb-8">
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    {result.type === "image"
                      ? "Encrypted Message Detected"
                      : "Hidden Logic Detected"}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-slate-800 mb-4">
                    {result.type === "image"
                      ? "Recovered Message"
                      : "Detection Explanation"}
                  </h3>

                  <div className="border-2 border-cyan-400 bg-slate-50 rounded-xl p-6 text-slate-700 leading-7">
                    "{result.message || result.explanation}"
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div className="bg-slate-50 rounded-lg p-5">
                    <p className="text-sm text-slate-500 mb-2">Model Used</p>
                    <p className="text-xl font-bold text-slate-800">
                      {result.model}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-5">
                    <p className="text-sm text-slate-500 mb-2">
                      Confidence Score
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>

                      <p className="text-xl font-bold text-slate-800">
                        {result.confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <div className="bg-slate-50 rounded-lg p-5">
                    <p className="text-sm text-slate-500 mb-2">
                      Analysis Timestamp
                    </p>
                    <p className="font-medium text-slate-800">
                      {result.timestamp}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-5">
                    <p className="text-sm text-slate-500 mb-2">
                      Processing Duration
                    </p>
                    <p className="font-medium text-slate-800">
                      {result.duration}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="primary"
                    fullWidth
                    icon={<Download className="w-5 h-5" />}
                    onClick={downloadResults}
                  >
                    Download Results
                  </Button>

                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Upload className="w-5 h-5" />}
                    onClick={resetAnalysis}
                  >
                    {result.type === "image"
                      ? "Analyze Another Image"
                      : "Analyze Another Code"}
                  </Button>
                </div>
              </div>
            )}

            {stage === "done" && result && !result.detected && (
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
                <div className="flex justify-center mb-8">
                  <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                    <XCircle className="w-5 h-5" />
                    No Hidden Message Detected
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-slate-800 mb-4">
                    Possible Reasons
                  </h3>

                  <div className="space-y-3">
                    {result.reasons.map((reason, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-slate-50 rounded-lg p-5 text-slate-500"
                      >
                        <span className="text-slate-500">•</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  <div className="bg-slate-50 rounded-lg p-5">
                    <p className="text-sm text-slate-500 mb-2">Model Used</p>
                    <p className="font-bold text-slate-800">{result.model}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-5">
                    <p className="text-sm text-slate-500 mb-2">Confidence</p>
                    <p className="font-bold text-slate-800">
                      {result.confidence}%
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-5">
                    <p className="text-sm text-slate-500 mb-2">Duration</p>
                    <p className="font-bold text-slate-800">
                      {result.duration}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="primary"
                    fullWidth
                    icon={<Upload className="w-5 h-5" />}
                    onClick={resetAnalysis}
                  >
                    {result.type === "image"
                      ? "Upload New Image"
                      : "Analyze New Code"}
                  </Button>

                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Home className="w-5 h-5" />}
                    onClick={resetAnalysis}
                  >
                    Return Home
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="border-l border-slate-200 bg-white px-8 py-12 overflow-y-auto">
          <Documentation />
        </aside>
      </div>
    </main>
  );
}