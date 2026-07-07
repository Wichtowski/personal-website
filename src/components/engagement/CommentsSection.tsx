"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@context/LanguageContext";
import { formatDate } from "@lib/date";
import { MessageSquare, User, AtSign, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: string;
  displayName: string;
  body: string;
  createdAt: string;
}

interface CommentsSectionProps {
  targetId: string;
}

export function CommentsSection({ targetId }: CommentsSectionProps) {
  const { t, language } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem("commenter_email") || "";
    const savedUsername = localStorage.getItem("commenter_username") || "";

    if (savedEmail || savedUsername) {
      setTimeout(() => {
        setEmail(savedEmail);
        setUsername(savedUsername);
      }, 0);
    }

    async function loadComments() {
      try {
        const res = await fetch(`/api/comments?targetId=${encodeURIComponent(targetId)}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [targetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);
    setSuccessStatus(null);

    if (!email || !email.includes("@")) {
      setErrorStatus(t.engagement.commentValidationEmail);
      return;
    }
    if (!commentText.trim()) {
      setErrorStatus(t.engagement.commentValidationBody);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetId,
          email: email.trim(),
          username: username.trim() || undefined,
          comment: commentText.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("commenter_email", email.trim());
        localStorage.setItem("commenter_username", username.trim());

        setComments((prev) => [...prev, data.comment]);
        setCommentText("");
        setSuccessStatus(t.engagement.commentSuccess);

        setTimeout(() => setSuccessStatus(null), 3000);
      } else {
        setErrorStatus(data.error || "Failed to submit comment. Please try again.");
      }
    } catch (err) {
      console.error("Comment submission error:", err);
      setErrorStatus("A network error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const getAvatarColor = (name: string) => {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "bg-red-500/20 text-red-400 border-red-500/30",
      "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "bg-green-500/20 text-green-400 border-green-500/30",
      "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    ];
    return colors[hash % colors.length];
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12 pt-8 border-t border-border/20">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-mono font-bold tracking-tight text-foreground">
          {t.engagement.commentsSectionTitle} ({comments.length})
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 p-5 rounded-xl border border-border/40 bg-background/30 backdrop-blur-sm space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="w-3 h-3 text-primary" />
              {t.engagement.commentInputName.split(" (")[0]}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. CodeExplorer"
              className="w-full text-sm font-mono p-2.5 rounded-lg border border-border/50 bg-background hover:border-primary/30 focus:border-primary focus:outline-none transition-colors"
            />
            <span className="text-[10px] text-muted-foreground block font-mono">
              {language === "pl"
                ? "* Opcjonalne (email zostanie ukryty)"
                : "* Optional (hides your email)"}
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <AtSign className="w-3 h-3 text-destructive" />
              {t.engagement.commentInputEmail.split(" (")[0]}{" "}
              <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full text-sm font-mono p-2.5 rounded-lg border border-border/50 bg-background hover:border-primary/30 focus:border-primary focus:outline-none transition-colors"
            />
            <span className="text-[10px] text-muted-foreground block font-mono">
              {language === "pl"
                ? "* Wymagane (ukryte i nigdy nie udostępniane)"
                : "* Required (private, never shared)"}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            {t.engagement.commentInputBody} <span className="text-destructive">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              language === "pl"
                ? "Dodaj wartościowy komentarz..."
                : "Write a constructive comment..."
            }
            className="w-full text-sm font-mono p-2.5 rounded-lg border border-border/50 bg-background hover:border-primary/30 focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-xs font-mono">
            {errorStatus && <span className="text-destructive font-bold">{errorStatus}</span>}
            {successStatus && <span className="text-green-400 font-bold">{successStatus}</span>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {t.engagement.commenting}
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                {t.engagement.commentBtn}
              </>
            )}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center py-8 text-sm font-mono text-muted-foreground border border-dashed border-border/40 rounded-xl bg-background/10">
            {t.engagement.noComments}
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {comments.map((c) => {
              const initials = c.displayName ? c.displayName.substring(0, 2).toUpperCase() : "??";
              const avatarCls = getAvatarColor(c.displayName || "");

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="p-4 rounded-xl border border-border/30 bg-background/15 flex gap-4 items-start"
                >
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold shrink-0 ${avatarCls}`}
                  >
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-sm font-mono font-bold text-foreground">
                        {c.displayName}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                        {formatDate(c.createdAt, language, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-mono font-medium text-foreground/85 whitespace-pre-wrap break-all leading-relaxed">
                      {c.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
