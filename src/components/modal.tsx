import { useEffect } from "react";
import Profile from "~/components/pages/profile";
import Lab from "~/components/pages/lab";

interface ModalProps {
  contentType: string | null;
  onClose: () => void;
}

export default function Modal({ contentType, onClose }: ModalProps) {
  useEffect(() => {
    if (contentType) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [contentType]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (contentType) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [contentType, onClose]);

  if (!contentType) return null;

  const renderContent = () => {
    switch (contentType) {
      case "profile":
        return <Profile />;
      case "lab":
        return <Lab />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative bg-background rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-sm"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="w-full h-full overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
