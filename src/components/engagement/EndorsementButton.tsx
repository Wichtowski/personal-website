"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@context/LanguageContext";
import { ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EndorsementButtonProps {
  targetId: string;
}

// Helpers for cookie operations to avoid react-hooks/immutability lint complaints
function setCookie(key: string, value: string, maxAge?: number) {
  if (typeof document !== "undefined") {
    const maxAgeSec = maxAge !== undefined ? `; max-age=${maxAge}` : "";
    document.cookie = `${key}=${value}; path=/; SameSite=Lax${maxAgeSec}`;
  }
}

function deleteCookie(key: string) {
  if (typeof document !== "undefined") {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  }
}

export function EndorsementButton({ targetId }: EndorsementButtonProps) {
  const { t } = useLanguage();
  const [count, setCount] = useState<number>(0);
  const [isEndorsed, setIsEndorsed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [email, setEmail] = useState<string>("");
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const storageKey = `endorse_${targetId}`;
    const endorsedInStorage = localStorage.getItem(storageKey) === "true";
    const endorsedInCookie =
      typeof document !== "undefined" && document.cookie.includes(`${storageKey}=true`);
    const initialEndorsed = endorsedInStorage || endorsedInCookie;

    if (initialEndorsed) {
      setTimeout(() => setIsEndorsed(true), 0);
      if (!endorsedInStorage) localStorage.setItem(storageKey, "true");
      if (!endorsedInCookie) {
        setCookie(storageKey, "true", 31536000);
      }
    }

    const savedEmail =
      localStorage.getItem("commenter_email") || localStorage.getItem("endorse_email") || "";
    if (savedEmail) {
      setTimeout(() => setEmail(savedEmail), 0);
    }

    async function fetchCount() {
      try {
        const res = await fetch(`/api/endorsements?targetId=${encodeURIComponent(targetId)}`);
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch (err) {
        console.error("Failed to fetch endorsement count:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCount();
  }, [targetId]);

  const submitEndorsement = async (action: "endorse" | "unendorse", submitEmail?: string) => {
    const endpointEmail = submitEmail?.trim() || email.trim() || undefined;

    try {
      const res = await fetch("/api/endorsements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetId, action, email: endpointEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setCount(data.count);
        return { success: true, count: data.count };
      } else {
        return { success: false, error: data.error, count: data.count ?? count };
      }
    } catch (err) {
      console.error("Failed to update endorsement:", err);
      return { success: false, error: "network_error" };
    }
  };

  const handleToggleEndorse = async () => {
    const nextState = !isEndorsed;

    if (nextState) {
      // Trying to endorse - check if we can submit or if we need to show the email field
      const trimmedEmail = email.trim();
      const isValidEmail = trimmedEmail.includes("@") && trimmedEmail.length > 3;

      if (!isValidEmail) {
        // Form needs to be shown and filled
        setShowEmailForm(true);
        setInputError(null);
        return;
      }

      // If pre-filled email exists, we can show the form so they click "OK"
      if (!showEmailForm) {
        setShowEmailForm(true);
        setInputError(null);
        return;
      }

      // If form is already open and email is valid, submit
      await handleFormSubmit();
    } else {
      // Trying to unendorse
      setIsEndorsed(false);
      setCount((prev) => Math.max(0, prev - 1));

      const storageKey = `endorse_${targetId}`;
      localStorage.removeItem(storageKey);
      deleteCookie(storageKey);

      const result = await submitEndorsement("unendorse");

      if (!result.success) {
        // Rollback state on failure
        setIsEndorsed(true);
        setCount((prev) => prev + 1);
        localStorage.setItem(storageKey, "true");
        setCookie(storageKey, "true", 31536000);
        if (result.count !== undefined) setCount(result.count);
      }
    }
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@") || trimmedEmail.length < 4) {
      setInputError(t.engagement.endorseEmailError);
      return;
    }

    setIsSubmitting(true);
    const result = await submitEndorsement("endorse", trimmedEmail);

    if (result.success) {
      setIsEndorsed(true);
      setShowEmailForm(false);
      const storageKey = `endorse_${targetId}`;
      localStorage.setItem(storageKey, "true");
      localStorage.setItem("endorse_email", trimmedEmail);
      setCookie(storageKey, "true", 31536000);
    } else {
      if (result.error === "already_endorsed") {
        // Synchronize state if they already endorsed on the backend
        setIsEndorsed(true);
        setShowEmailForm(false);
        const storageKey = `endorse_${targetId}`;
        localStorage.setItem(storageKey, "true");
        localStorage.setItem("endorse_email", trimmedEmail);
        setCookie(storageKey, "true", 31536000);
        if (result.count !== undefined) setCount(result.count);
      } else {
        setInputError(
          result.error === "Invalid email"
            ? t.engagement.endorseEmailError
            : result.error === "already_endorsed"
              ? t.engagement.endorseEmailAlreadyUsed
              : result.error || "An error occurred. Please try again.",
        );
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 my-8 rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm max-w-sm mx-auto">
      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-4">
        {t.engagement.endorseSectionTitle}
      </h3>
      <div className="flex items-center gap-4 w-full justify-center">
        <motion.button
          onClick={handleToggleEndorse}
          disabled={loading || isSubmitting}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-mono font-bold transition-all duration-300 ${
            isEndorsed
              ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--color-primary),0.3)] border border-primary"
              : "bg-background border border-border/65 hover:border-primary/50 text-foreground"
          }`}
        >
          <ThumbsUp
            className={`w-4 h-4 transition-transform duration-300 ${
              isEndorsed ? "fill-current scale-110" : ""
            }`}
          />
          {isEndorsed ? t.engagement.endorsedBtn : t.engagement.endorseBtn}
        </motion.button>
        <div className="text-right">
          <span className="text-lg font-mono font-bold block leading-none">
            {loading ? "..." : count}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            {t.engagement.endorseCount}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {showEmailForm && !isEndorsed && (
          <motion.form
            onSubmit={handleFormSubmit}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="w-full overflow-hidden space-y-2 border-t border-border/20 pt-4 flex flex-col items-center"
          >
            <div className="w-full space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground block text-left">
                {t.engagement.endorseEmailLabel}
              </label>
              <div className="flex gap-2 w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  placeholder={t.engagement.endorseEmailPlaceholder}
                  className="flex-1 text-xs font-mono p-2 rounded-lg border border-border/50 bg-background hover:border-primary/30 focus:border-primary focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center min-w-[70px]"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "OK"
                  )}
                </button>
              </div>
              <span className="text-[9px] text-muted-foreground block font-mono text-left w-full">
                {t.engagement.endorseEmailHint}
              </span>
            </div>
            {inputError && (
              <span className="text-[10px] text-destructive font-mono font-bold self-start mt-1">
                {inputError}
              </span>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
