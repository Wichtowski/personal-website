"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@context/LanguageContext";
import { ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

interface EndorsementButtonProps {
  targetId: string;
}

export function EndorsementButton({ targetId }: EndorsementButtonProps) {
  const { t } = useLanguage();
  const [count, setCount] = useState<number>(0);
  const [isEndorsed, setIsEndorsed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storageKey = `endorse_${targetId}`;
    const endorsedInStorage = localStorage.getItem(storageKey) === "true";
    const endorsedInCookie = document.cookie.includes(`${storageKey}=true`);
    const initialEndorsed = endorsedInStorage || endorsedInCookie;

    if (initialEndorsed) {
      setTimeout(() => setIsEndorsed(true), 0);
      if (!endorsedInStorage) localStorage.setItem(storageKey, "true");
      if (!endorsedInCookie) {
        document.cookie = `${storageKey}=true; path=/; max-age=31536000; SameSite=Lax`;
      }
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

  const handleToggleEndorse = async () => {
    const nextState = !isEndorsed;
    const action = nextState ? "endorse" : "unendorse";

    setIsEndorsed(nextState);
    setCount((prev) => Math.max(0, nextState ? prev + 1 : prev - 1));

    const storageKey = `endorse_${targetId}`;
    if (nextState) {
      localStorage.setItem(storageKey, "true");
      document.cookie = `${storageKey}=true; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      localStorage.removeItem(storageKey);
      document.cookie = `${storageKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }

    try {
      const res = await fetch("/api/endorsements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetId, action }),
      });

      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
      } else {
        setIsEndorsed(!nextState);
        setCount((prev) => Math.max(0, !nextState ? prev + 1 : prev - 1));
        if (!nextState) {
          localStorage.setItem(storageKey, "true");
          document.cookie = `${storageKey}=true; path=/; max-age=31536000; SameSite=Lax`;
        } else {
          localStorage.removeItem(storageKey);
          document.cookie = `${storageKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        }
      }
    } catch (err) {
      console.error("Failed to update endorsement:", err);
      setIsEndorsed(!nextState);
      setCount((prev) => Math.max(0, !nextState ? prev + 1 : prev - 1));
      if (!nextState) {
        localStorage.setItem(storageKey, "true");
        document.cookie = `${storageKey}=true; path=/; max-age=31536000; SameSite=Lax`;
      } else {
        localStorage.removeItem(storageKey);
        document.cookie = `${storageKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 my-8 rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm max-w-sm mx-auto">
      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-4">
        {t.engagement.endorseSectionTitle}
      </h3>
      <div className="flex items-center gap-4">
        <motion.button
          onClick={handleToggleEndorse}
          disabled={loading}
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
    </div>
  );
}
