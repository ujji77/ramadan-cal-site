import { useState } from "react";

export default function InstallBar() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("npm install -g ramadan-cal");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = "npm install -g ramadan-cal";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="inline-flex items-center gap-3 rounded-[10px] px-5 py-2.5 max-sm:flex-col max-sm:gap-2"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <code
        className="font-mono text-sm select-all"
        style={{ color: "var(--text)" }}
      >
        npm install -g ramadan-cal
      </code>
      <button
        onClick={handleCopy}
        className="px-3.5 py-1.5 rounded-md font-mono text-xs font-medium transition-colors cursor-pointer"
        style={{
          background: copied ? "var(--green)" : "var(--accent)",
          color: "var(--bg)",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
