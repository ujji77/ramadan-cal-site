import { useEffect, useRef, useState } from "react";

const TERMINAL_LINES = [
  { type: "command", text: "$ npm install -g ramadan-cal" },
  { type: "output", text: "added 24 packages in 3s" },
  { type: "blank", text: "" },
  { type: "output", text: "   🌙 Ramadan CLI installed successfully!" },
  { type: "output", text: "   ✓ Claude Code integration configured" },
  { type: "blank", text: "" },
  { type: "command", text: "$ ramadan" },
  { type: "blank", text: "" },
  { type: "output", text: "🌙 Ramadan 1447" },
  { type: "output", text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
  { type: "output", text: "📅 15 Ramadan 1447 — Day 15 of 30" },
  { type: "output", text: "⏳ 15 days remaining" },
  { type: "blank", text: "" },
  { type: "output", text: "🕌 Prayer Times (London)" },
  { type: "output", text: "   Fajr     05:10     Maghrib  17:44" },
  { type: "output", text: "   Sunrise  06:41     Isha     19:16" },
  { type: "output", text: "   Dhuhr    12:13" },
  { type: "output", text: "   Asr      15:07" },
  { type: "blank", text: "" },
  { type: "output", text: "🍽️  Suhoor ends: 05:10 · Iftar: 17:44" },
  { type: "blank", text: "" },
  { type: "output", text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
  { type: "output", text: " Su  Mo  Tu  We  Th  Fr  Sa" },
  { type: "output", text: "         1̶   2̶   3̶   4̶   5̶" },
  { type: "output", text: "  6̶   7̶   8̶   9̶  1̶0̶  1̶1̶  1̶2̶" },
  { type: "output", text: " 1̶3̶  1̶4̶  [15] 16  17  18  19" },
  { type: "output", text: " 20  21  22  23  24  25  26" },
  { type: "output", text: " 27  28  29  30" },
  { type: "output", text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
];

export default function Terminal() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    async function typeText(text: string, speed: number) {
      for (let i = 0; i <= text.length; i++) {
        if (cancelled) return;
        setCurrentTyping(text.slice(0, i));
        await sleep(speed);
      }
    }

    async function runAnimation() {
      if (animatingRef.current) return;
      animatingRef.current = true;

      while (!cancelled) {
        setDisplayedLines([]);
        setCurrentTyping("");
        setOpacity(1);

        for (let i = 0; i < TERMINAL_LINES.length; i++) {
          if (cancelled) return;
          const line = TERMINAL_LINES[i];

          if (line.type === "command") {
            await typeText(line.text, 45);
            await sleep(500);
            setDisplayedLines((prev) => [...prev, line.text]);
            setCurrentTyping("");
          } else if (line.type === "output") {
            setDisplayedLines((prev) => [...prev, line.text]);
            await sleep(35);
          } else {
            setDisplayedLines((prev) => [...prev, ""]);
            await sleep(20);
          }

          if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
          }
        }

        // Show final cursor blinking
        setCurrentTyping("$ ");
        await sleep(5000);

        // Fade out and restart
        setOpacity(0);
        await sleep(400);
      }
    }

    runAnimation();

    return () => {
      cancelled = true;
      animatingRef.current = false;
    };
  }, []);

  return (
    <div
      className="rounded-xl overflow-hidden w-full"
      style={{
        border: "1px solid #222",
        transition: "opacity 0.4s",
        opacity,
      }}
    >
      {/* Chrome bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: "var(--terminal-chrome)" }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "var(--dot-red)" }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "var(--dot-yellow)" }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "var(--dot-green)" }}
        />
      </div>

      {/* Terminal body */}
      <div
        ref={bodyRef}
        className="p-5 font-mono text-[13px] leading-[1.7] overflow-y-auto max-sm:text-[11px] max-sm:p-3.5 max-sm:min-h-[320px]"
        style={{
          background: "var(--terminal-bg)",
          minHeight: 580,
          color: "#d4d4d4",
        }}
      >
        {displayedLines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {line || "\u00A0"}
          </div>
        ))}
        {currentTyping !== "" && (
          <div className="whitespace-pre">
            {currentTyping}
            {showCursor && (
              <span className="animate-blink inline-block w-[8px] h-[14px] align-middle ml-px" style={{ background: "var(--accent)" }} />
            )}
          </div>
        )}
        {currentTyping === "" && displayedLines.length === 0 && (
          <div className="whitespace-pre">
            {"$ "}
            <span className="animate-blink inline-block w-[8px] h-[14px] align-middle ml-px" style={{ background: "var(--accent)" }} />
          </div>
        )}
      </div>
    </div>
  );
}
