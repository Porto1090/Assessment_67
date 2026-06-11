import { useState, useEffect, useRef } from "react";

export function useDashboardAnalysis() {
  const [mode, setMode] = useState("image");
  const [stage, setStage] = useState("idle");
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing analysis...");
  const [code, setCode] = useState(`Texto predeterminado para análisis de código.`);
  const [imageAction, setImageAction] = useState("decode");

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

    const history = JSON.parse(localStorage.getItem("analysisHistory") || "[]");

    history.unshift(historyItem);
    localStorage.setItem("analysisHistory", JSON.stringify(history));
  };

  const analyzeImage = (file) => {
    if (!file) return;

    if (!file.type.match(/image\/(png)/)) {
      alert("Please upload a PNG image");
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
  }

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
  
  return {
    mode, changeMode,
    stage,
    result, downloadResults, resetAnalysis,
    fileName,
    progress, loadingMessage,
    code, setCode, runCodeAnalysis,
    fileInputRef, analyzeImage,
    imageAction, setImageAction
  };
}