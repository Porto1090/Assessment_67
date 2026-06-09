import { useState, useRef } from "react";
import {
  Upload,
  FileImage,
  CheckCircle2,
  XCircle,
  Download,
  Home,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";

const processingStages = [
  { stage: "analyzing", message: "Analyzing image..." },
  { stage: "detecting", message: "Detecting hidden patterns..." },
  { stage: "extracting", message: "Extracting visual features..." },
  { stage: "applying", message: "Applying CNN model..." },
  { stage: "classifying", message: "Running classification..." },
  { stage: "generating", message: "Generating results..." },
];

export default function Dashboard() {
  const [stage, setStage] = useState("idle");
  const [result, setResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file.type.match(/image\/(jpeg|jpg)/)) {
      alert("Please upload a JPG/JPEG image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      setUploadedImage(e.target?.result);
      startAnalysis(file.name);
    };

    reader.readAsDataURL(file);
  };

  const startAnalysis = (selectedFileName) => {
    const startTime = Date.now();

    setStage("uploading");
    setProgress(0);

    let currentStageIndex = 0;

    const stageInterval = setInterval(() => {
      if (currentStageIndex < processingStages.length) {
        setStage(processingStages[currentStageIndex].stage);
        setProgress(
          ((currentStageIndex + 1) / processingStages.length) * 100
        );
        currentStageIndex++;
      } else {
        clearInterval(stageInterval);

        const detected = Math.random() > 0.3;
        const model = Math.random() > 0.5 ? "CNN" : "SVM";
        const confidence = detected
          ? Math.floor(Math.random() * 20) + 80
          : Math.floor(Math.random() * 30) + 10;

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);

        if (detected) {
          setResult({
            detected: true,
            message:
              "The secret lies beneath the surface. Trust no one, verify everything.",
            model,
            confidence,
            timestamp: new Date().toLocaleString(),
            duration: `${duration}s`,
          });

          setStage("success");
        } else {
          setResult({
            detected: false,
            model,
            confidence,
            timestamp: new Date().toLocaleString(),
            duration: `${duration}s`,
            reasons: [
              "No encrypted content present",
              "Image quality too low",
              "Unsupported encoding method",
              "Compression altered hidden data",
            ],
          });

          setStage("failure");
        }

        const historyItem = {
          date: new Date().toISOString(),
          fileName: selectedFileName,
          model,
          detected,
          confidence,
        };

        const history = JSON.parse(
          localStorage.getItem("analysisHistory") || "[]"
        );

        history.unshift(historyItem);

        localStorage.setItem("analysisHistory", JSON.stringify(history));
      }
    }, 800);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  const resetToUpload = () => {
    setStage("idle");
    setResult(null);
    setUploadedImage(null);
    setFileName("");
    setProgress(0);
  };

  const downloadResults = () => {
    if (!result) return;

    const resultText = `
CipherVision - Analysis Results
=====================================

Detection Status: ${result.detected ? "Message Detected" : "No Message Detected"}
${result.detected ? `Recovered Message: ${result.message}` : ""}
Model Used: ${result.model}
Confidence Score: ${result.confidence}%
Analysis Timestamp: ${result.timestamp}
Processing Duration: ${result.duration}

File Name: ${fileName}
    `.trim();

    const blob = new Blob([resultText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `ciphervision-results-${Date.now()}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const getCurrentStageMessage = () => {
    const current = processingStages.find((item) => item.stage === stage);
    return current?.message || "Processing...";
  };

  const isProcessing =
    stage === "uploading" ||
    stage === "analyzing" ||
    stage === "detecting" ||
    stage === "extracting" ||
    stage === "applying" ||
    stage === "classifying" ||
    stage === "generating";

  return (
    <div
      className="min-h-[calc(100vh-64px)]"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-16">
                <h1
                  className="mb-4"
                  style={{
                    fontSize: "48px",
                    fontWeight: 700,
                    color: "#1E293B",
                    lineHeight: "1.2",
                  }}
                >
                  Recover Hidden Messages from Images
                </h1>

                <p
                  className="max-w-2xl mx-auto mb-8"
                  style={{
                    fontSize: "18px",
                    color: "#64748B",
                    lineHeight: "1.6",
                  }}
                >
                  Upload an image and allow our AI models to analyze hidden
                  encrypted information.
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer hover:border-[#3B82F6] hover:bg-[#F8FAFC]"
                  style={{
                    borderColor: isDragging ? "#3B82F6" : "#E2E8F0",
                    backgroundColor: isDragging ? "#EFF6FF" : "#FFFFFF",
                  }}
                >
                  <div className="flex justify-center mb-6">
                    <div
                      className="flex items-center justify-center w-20 h-20 rounded-full"
                      style={{ backgroundColor: "#EFF6FF" }}
                    >
                      <Upload
                        className="w-10 h-10"
                        style={{ color: "#3B82F6" }}
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
                    Drag & Drop your image here
                  </h3>

                  <p
                    className="mb-6"
                    style={{
                      fontSize: "14px",
                      color: "#64748B",
                    }}
                  >
                    or click to browse files
                  </p>

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

                  <div className="mt-6 flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className="w-4 h-4"
                        style={{ color: "#22C55E" }}
                      />
                      <span style={{ fontSize: "13px", color: "#64748B" }}>
                        JPG/JPEG supported
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className="w-4 h-4"
                        style={{ color: "#22C55E" }}
                      />
                      <span style={{ fontSize: "13px", color: "#64748B" }}>
                        Maximum 10MB
                      </span>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="flex justify-center mb-8">
                  <motion.div
                    className="relative"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-24 h-24 rounded-full"
                      style={{ backgroundColor: "#EFF6FF" }}
                    >
                      <Loader2
                        className="w-12 h-12 animate-spin"
                        style={{ color: "#3B82F6" }}
                      />
                    </div>
                  </motion.div>
                </div>

                <h2
                  className="mb-4"
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#1E293B",
                  }}
                >
                  Analyzing Your Image
                </h2>

                <div className="mb-6">
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "#E2E8F0" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: "#3B82F6" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <p
                    className="mt-2"
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#64748B",
                    }}
                  >
                    {Math.round(progress)}%
                  </p>
                </div>

                <motion.p
                  key={stage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    fontSize: "16px",
                    color: "#64748B",
                    fontWeight: 500,
                  }}
                >
                  {getCurrentStageMessage()}
                </motion.p>
              </div>
            </motion.div>
          )}

          {stage === "success" && result?.detected && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-center mb-6">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ backgroundColor: "#DCFCE7" }}
                  >
                    <CheckCircle2
                      className="w-5 h-5"
                      style={{ color: "#22C55E" }}
                    />
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#166534",
                      }}
                    >
                      Encrypted Message Detected
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3
                    className="mb-4"
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#1E293B",
                    }}
                  >
                    Recovered Message
                  </h3>

                  <div
                    className="p-6 rounded-xl"
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "2px solid #06B6D4",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        color: "#1E293B",
                        lineHeight: "1.8",
                        fontWeight: 500,
                      }}
                    >
                      "{result.message}"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "#F8FAFC" }}
                  >
                    <p
                      className="mb-1"
                      style={{ fontSize: "13px", color: "#64748B" }}
                    >
                      Model Used
                    </p>
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#1E293B",
                      }}
                    >
                      {result.model}
                    </p>
                  </div>

                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "#F8FAFC" }}
                  >
                    <p
                      className="mb-1"
                      style={{ fontSize: "13px", color: "#64748B" }}
                    >
                      Confidence Score
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div
                          className="w-full h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: "#E2E8F0" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: "#22C55E",
                              width: `${result.confidence}%`,
                            }}
                          />
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#1E293B",
                        }}
                      >
                        {result.confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 rounded-lg"
                  style={{ backgroundColor: "#F8FAFC" }}
                >
                  <div>
                    <p style={{ fontSize: "13px", color: "#64748B" }}>
                      Analysis Timestamp
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1E293B",
                      }}
                    >
                      {result.timestamp}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: "13px", color: "#64748B" }}>
                      Processing Duration
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1E293B",
                      }}
                    >
                      {result.duration}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={downloadResults}
                    icon={<Download className="w-5 h-5" />}
                  >
                    Download Results
                  </Button>

                  <Button
                    variant="outline"
                    fullWidth
                    onClick={resetToUpload}
                    icon={<Upload className="w-5 h-5" />}
                  >
                    Analyze Another Image
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {stage === "failure" && !result?.detected && (
            <motion.div
              key="failure"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-center mb-6">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ backgroundColor: "#FEE2E2" }}
                  >
                    <XCircle
                      className="w-5 h-5"
                      style={{ color: "#EF4444" }}
                    />
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#991B1B",
                      }}
                    >
                      No Hidden Message Detected
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3
                    className="mb-4"
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#1E293B",
                    }}
                  >
                    Possible Reasons
                  </h3>

                  <div className="space-y-3">
                    {result?.reasons?.map((reason, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-lg"
                        style={{ backgroundColor: "#F8FAFC" }}
                      >
                        <div className="mt-0.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "#64748B" }}
                          />
                        </div>

                        <p style={{ fontSize: "14px", color: "#64748B" }}>
                          {reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 rounded-lg"
                  style={{ backgroundColor: "#F8FAFC" }}
                >
                  <div>
                    <p style={{ fontSize: "13px", color: "#64748B" }}>
                      Model Used
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1E293B",
                      }}
                    >
                      {result?.model}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: "13px", color: "#64748B" }}>
                      Confidence
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1E293B",
                      }}
                    >
                      {result?.confidence}%
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: "13px", color: "#64748B" }}>
                      Duration
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1E293B",
                      }}
                    >
                      {result?.duration}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={resetToUpload}
                    icon={<Upload className="w-5 h-5" />}
                  >
                    Upload New Image
                  </Button>

                  <Button
                    variant="outline"
                    fullWidth
                    onClick={resetToUpload}
                    icon={<Home className="w-5 h-5" />}
                  >
                    Return Home
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}