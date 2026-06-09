import {
  FileImage,
  Brain,
  HelpCircle,
  Shield,
} from "lucide-react";

export default function Help() {
  return (
    <div
      className="min-h-[calc(100vh-64px)] py-12"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="mb-3"
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#1E293B",
            }}
          >
            Help Center
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#64748B",
            }}
          >
            Learn how to use CipherVision AI effectively
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0"
              style={{ backgroundColor: "#EFF6FF" }}
            >
              <Brain
                className="w-6 h-6"
                style={{ color: "#3B82F6" }}
              />
            </div>

            <div>
              <h2
                className="mb-2"
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1E293B",
                }}
              >
                How the System Works
              </h2>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                  lineHeight: "1.6",
                }}
              >
                CipherVision AI uses advanced machine learning models
                to detect and recover hidden encrypted messages
                embedded inside images.
              </p>
            </div>
          </div>

          <div className="space-y-4 ml-16">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <h3
                className="mb-2"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                1. Upload an Image
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                }}
              >
                Upload a JPG or JPEG image that may contain hidden
                information.
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <h3
                className="mb-2"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                2. AI Analysis
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                }}
              >
                CNN and SVM models analyze image patterns looking for
                hidden encrypted content.
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <h3
                className="mb-2"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                3. Message Extraction
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                }}
              >
                If a hidden message is detected, the system extracts
                and displays the recovered content.
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <h3
                className="mb-2"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                4. Results & History
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                }}
              >
                Download your results and access previous analyses
                through the History section.
              </p>
            </div>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg"
              style={{ backgroundColor: "#EFF6FF" }}
            >
              <FileImage
                className="w-6 h-6"
                style={{ color: "#3B82F6" }}
              />
            </div>

            <div>
              <h2
                className="mb-2"
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1E293B",
                }}
              >
                Supported Formats
              </h2>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                }}
              >
                Recommended specifications for best results.
              </p>
            </div>
          </div>

          <div className="space-y-4 ml-16">
            <p><strong>Format:</strong> JPG / JPEG</p>
            <p><strong>Maximum Size:</strong> 10 MB</p>
            <p><strong>Recommended Resolution:</strong> 800x600+</p>
            <p><strong>Best Quality:</strong> Uncompressed images</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg"
              style={{ backgroundColor: "#EFF6FF" }}
            >
              <HelpCircle
                className="w-6 h-6"
                style={{ color: "#3B82F6" }}
              />
            </div>

            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#1E293B",
              }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6 ml-16">
            <div>
              <h3 className="font-semibold mb-2">
                What is steganography?
              </h3>

              <p className="text-slate-500">
                Steganography hides secret information inside ordinary
                files or images without revealing that data exists.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                How accurate is the AI?
              </h3>

              <p className="text-slate-500">
                Detection confidence typically ranges from 80% to 99%
                when hidden content is present.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                What are CNN and SVM?
              </h3>

              <p className="text-slate-500">
                They are machine learning models used to identify
                hidden patterns and encrypted data in images.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Why wasn't a message detected?
              </h3>

              <p className="text-slate-500">
                The image may not contain hidden data, the quality may
                be insufficient, or the encoding method may not be
                supported.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Is my data secure?
              </h3>

              <p className="text-slate-500">
                All analysis is performed locally in your browser.
              </p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div
          className="mt-8 p-6 rounded-xl border"
          style={{
            backgroundColor: "#EFF6FF",
            borderColor: "#3B82F6",
          }}
        >
          <div className="flex items-start gap-3">
            <Shield
              className="w-6 h-6 flex-shrink-0"
              style={{ color: "#3B82F6" }}
            />

            <div>
              <h3
                className="mb-2"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                Security & Privacy
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                  lineHeight: "1.6",
                }}
              >
                CipherVision is intended for educational and research
                purposes. Images are analyzed locally and are not sent
                to external servers.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}