import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Home } from "lucide-react";
import Button from "@/components/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex min-h-screen items-center justify-center px-4 py-8 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-2xl text-center">
        {/* Title */}
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          The page you are looking for does not exist, may have been moved,
          or the URL might be incorrect.
        </p>

        {/* Decorative element */}
        <div className="mt-8">
          <img className="size-full" src="404.png" alt="Imagen 404" />
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="w-4 h-4" />
            Go Home Padawan
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Footer text */}
        <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
          CipherVision AI • Error 404
        </p>
      </div>
    </div>
  );
}