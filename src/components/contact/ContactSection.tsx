"use client";

import { useLanguage } from "@context/LanguageContext";
import { Mail, MapPin, Briefcase, Download } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { getNavDirection } from "@lib/navigation";
import { MdOutlineConnectWithoutContact } from "react-icons/md";

const email = "oskar.wichtowski3@gmail.com";

const socials = [
  {
    name: "GitHub",
    url: "https://github.com/Wichtowski",
    icon: FaGithub,
    label: "@Wichtowski",
    color: "hover:text-primary hover:border-primary/40 hover:bg-primary/5",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/oskar-wichtowski/",
    icon: FaLinkedin,
    label: "oskar-wichtowski",
    color: "hover:text-blue-500 hover:border-blue-500/40 hover:bg-blue-500/5",
  },
  {
    name: "Email",
    url: `mailto:${email}`,
    icon: Mail,
    label: email,
    color: "hover:text-green-500 hover:border-green-500/40 hover:bg-green-500/5",
  },
];

export function ContactSection() {
  const { t } = useLanguage();

  const handleDownloadCV = () => {
    const confirmed = window.confirm(t.contact.cvConfirm);
    if (!confirmed) {
      return;
    }

    const cvUrl = "/Oskar Wichtowski - Resume.pdf";
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = cvUrl.split("/").pop() || "cv.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const slideDirectionVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      get x() {
        return typeof window !== "undefined" ? getNavDirection() * 50 : 50;
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.5, type: "spring", stiffness: 60 },
    },
  };

  return (
    <section
      id="contact"
      className="w-screen h-full overflow-y-auto no-scrollbar flex flex-col justify-start md:justify-center bg-muted/10 relative pt-6 pb-20 md:pt-20 md:pb-16"
    >
      <div className="absolute inset-0 bg-radial-gradient from-primary/3 via-transparent to-transparent -z-10" />

      <motion.div
        variants={slideDirectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-5xl mx-auto px-6 w-full flex flex-col gap-12"
      >
        {/* Hero bento */}
        <div className="p-8 md:p-12 rounded-3xl border border-border/40 bg-muted/5 backdrop-blur-sm flex flex-col items-center text-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight font-mono flex flex-wrap items-center justify-center gap-3">
            <MdOutlineConnectWithoutContact
              size={72}
              className="text-primary animate-pulse shrink-0"
            />
            {t.contact.title}
          </h2>

          <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-xl leading-relaxed">
            {t.contact.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-4 justify-center w-full max-w-3xl">
            <a
              href={`mailto:${email}`}
              className="w-full sm:w-auto min-w-[13rem] px-6 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm font-bold hover:opacity-90 shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mail size={16} />
              {t.contact.emailMe}
            </a>

            <button
              onClick={handleDownloadCV}
              className="w-full sm:w-auto min-w-[13rem] px-6 py-3 rounded-xl border border-border/50 bg-background/80 text-foreground font-mono text-sm font-bold hover:bg-muted/60 hover:border-primary/40 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download size={16} />
              {t.contact.downloadCv}
            </button>
          </div>
        </div>

        {/* Info + Socials row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Availability card */}
          <div className="p-6 rounded-2xl border border-border/40 bg-muted/5 backdrop-blur-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-green-500 font-semibold tracking-wider uppercase">
                Available for work
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
              <MapPin size={14} className="shrink-0" />
              Poland — Remote / On-site
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
              <Briefcase size={14} className="shrink-0" />
              AI Engineer · Full-stack · QA
            </div>
          </div>

          {/* Socials card */}
          <div className="p-6 rounded-2xl border border-border/40 bg-muted/5 backdrop-blur-sm flex flex-col gap-3">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-background text-muted-foreground transition-all duration-300 ${s.color}`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="text-sm font-mono truncate">{s.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs font-mono text-muted-foreground/60">
          &copy; {new Date().getFullYear()} Oskar Wichtowski. All rights reserved.
        </p>
      </motion.div>
    </section>
  );
}
