import React, { useState, useRef } from "react";
import { submitFeedback } from "../../../../AppData/forbidden/dev/footer/user.feedback.submission";
// ─── Types ────────────────────────────────────────────────────────────────────
type SubmitState = "idle" | "submitting" | "submitted";

// ─── Chat Bubble Icon ─────────────────────────────────────────────────────────
const ChatBubbleIcon: React.FC = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="8" y="8" width="38" height="28" rx="6" fill="#F59E0B" />
    <polygon points="12,36 8,46 22,36" fill="#F59E0B" />
    <rect x="18" y="22" width="38" height="28" rx="6" fill="#FBBF24" opacity="0.85" />
    <polygon points="52,50 56,60 42,50" fill="#FBBF24" opacity="0.85" />
  </svg>
);

// ─── Star Component ───────────────────────────────────────────────────────────
interface StarProps {
  index: number;
  rating: number;
  hovered: number;
  onRate: (val: number) => void;
  onHover: (val: number) => void;
  onLeave: () => void;
}

const Star: React.FC<StarProps> = ({ index, rating, hovered, onRate, onHover, onLeave }) => {
  const filled = index <= (hovered || rating);
  return (
    <button
      type="button"
      aria-label={`Rate ${index} star${index !== 1 ? "s" : ""}`}
      onClick={() => onRate(index)}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      style={{
        background: filled ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)",
        border: filled ? "1.5px solid rgba(245,158,11,0.5)" : "1.5px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        width: "52px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: filled ? "scale(1.12)" : "scale(1)",
        outline: "none",
      }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill={filled ? "#F59E0B" : "none"}
        stroke={filled ? "#F59E0B" : "rgba(255,255,255,0.25)"}
        strokeWidth="1.8"
        style={{
          filter: filled ? "drop-shadow(0 0 6px rgba(245,158,11,0.7))" : "none",
          transition: "all 0.2s ease",
        }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
};

// ─── Rating Label ─────────────────────────────────────────────────────────────
const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

// ─── Submit Feedback Popup ────────────────────────────────────────────────────
interface SubmitFeedbackPopupProps {
  onClose: () => void;
}

export const SubmitFeedbackPopup: React.FC<SubmitFeedbackPopupProps> = ({ onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setError(null);
    setSubmitState("submitting");

    const result = await submitFeedback({ rating, message: message.trim() });

    if (result.success) {
      setSubmitState("submitted");
      setTimeout(() => {
        setSubmitState("idle");
        setRating(0);
        setMessage("");
      }, 3000);
    } else {
      setSubmitState("idle");
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  const buttonLabel =
    submitState === "submitting"
      ? "Submitting..."
      : submitState === "submitted"
      ? "Feedback Submitted ✓"
      : "Send Feedback";

  return (
    // Backdrop
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        style={{
          background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
          width: "100%",
          maxWidth: "460px",
          padding: "36px 32px 32px",
          position: "relative",
          animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          top: "-400px"
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close feedback"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(255,255,255,0.5)",
            fontSize: "18px",
            transition: "all 0.2s ease",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)";
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)";
          }}
        >
          ×
        </button>

        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <ChatBubbleIcon />
        </div>

        {/* Title */}
        <h2
          id="feedback-title"
          style={{
            color: "#ffffff",
            fontSize: "22px",
            fontWeight: 700,
            textAlign: "center",
            margin: "0 0 8px",
            letterSpacing: "-0.3px",
          }}
        >
          Submit Your Feedback
        </h2>

        {/* Subtitle */}
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "13px",
            textAlign: "center",
            margin: "0 0 28px",
            lineHeight: 1.6,
          }}
        >
          How's your experience? We'd love to hear from you.
        </p>

        {/* Stars */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: rating ? "12px" : "28px",
            transition: "margin-bottom 0.2s ease",
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              index={i}
              rating={rating}
              hovered={hovered}
              onRate={setRating}
              onHover={setHovered}
              onLeave={() => setHovered(0)}
            />
          ))}
        </div>

        {/* Rating label */}
        {(hovered > 0 || rating > 0) && (
          <p
            style={{
              color: "#F59E0B",
              fontSize: "13px",
              fontWeight: 600,
              textAlign: "center",
              margin: "0 0 20px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            {ratingLabels[hovered || rating]}
          </p>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message... (optional)"
          maxLength={1000}
          rows={4}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1.5px solid rgba(255,255,255,0.1)",
            borderRadius: "14px",
            padding: "14px 16px",
            color: "#ffffff",
            fontSize: "14px",
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            lineHeight: 1.6,
            boxSizing: "border-box",
            transition: "border-color 0.2s ease, background 0.2s ease",
            marginBottom: "8px",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(245,158,11,0.5)";
            e.target.style.background = "rgba(255,255,255,0.08)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.1)";
            e.target.style.background = "rgba(255,255,255,0.05)";
          }}
        />

        {/* Char count */}
        <p
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: "11px",
            textAlign: "right",
            margin: "0 0 20px",
          }}
        >
          {message.length}/1000
        </p>

        {/* Error */}
        {error && (
          <p
            role="alert"
            style={{
              color: "#f87171",
              fontSize: "12px",
              textAlign: "center",
              marginBottom: "12px",
              background: "rgba(248,113,113,0.1)",
              borderRadius: "8px",
              padding: "8px 12px",
              border: "1px solid rgba(248,113,113,0.2)",
            }}
          >
            {error}
          </p>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={submitState !== "idle"}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "14px",
            border: "none",
            background:
              submitState === "submitted"
                ? "linear-gradient(135deg, #059669, #10b981)"
                : "linear-gradient(135deg, #84cc16, #4ade80)",
            color: submitState === "submitted" ? "#fff" : "#14532d",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            cursor: submitState !== "idle" ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            opacity: submitState === "submitting" ? 0.8 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow:
              submitState === "submitted"
                ? "0 0 20px rgba(16,185,129,0.4)"
                : "0 4px 20px rgba(132,204,22,0.25)",
          }}
        >
          {submitState === "submitting" && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ animation: "spin 0.8s linear infinite" }}
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          )}
          {buttonLabel}
        </button>

        {/* Keyframe styles injected inline via style tag trick */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(24px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)    scale(1); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

// ─── Trigger Button (used in App.tsx footer) ──────────────────────────────────
export const UserFeedbackSubmission: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open feedback"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(245,158,11,0.12)",
          border: "1px solid rgba(245,158,11,0.3)",
          borderRadius: "20px",
          padding: "7px 16px",
          color: "#F59E0B",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s ease",
          outline: "none",
          letterSpacing: "0.3px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,158,11,0.2)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,158,11,0.6)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,158,11,0.12)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,158,11,0.3)";
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
        Feedback
      </button>

      {open && <SubmitFeedbackPopup onClose={() => setOpen(false)} />}
    </>
  );
};

export default UserFeedbackSubmission;