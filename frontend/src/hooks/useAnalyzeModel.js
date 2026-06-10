const API_URL = import.meta.env.VITE_BACKEND_URL;

export function useAnalyzeModel() {
  const analyzeImageRequest = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_URL}/analyze-image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image analysis failed");
    }

    return response.json();
  };

  const analyzeCodeRequest = async (code) => {
    const response = await fetch(`${API_URL}/analyze-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error("Code analysis failed");
    }

    return response.json();
  };

  return {
    analyzeImageRequest,
    analyzeCodeRequest,
  };
}