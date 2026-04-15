import { useState, useEffect, useRef } from "react";

const bootLines = [
  { text: "[    0.000000] Linux version 6.8.0-mamekuma (gcc 13.2.0)", delay: 0 },
  { text: "[    0.000001] Command line: BOOT_IMAGE=/vmlinuz-mamekuma root=/dev/sda1", delay: 100 },
  { text: "[    0.042069] BIOS-provided physical RAM map:", delay: 200 },
  { text: "[    0.042070]  BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable", delay: 280 },
  { text: "[    0.100000] CPU: AMD Ryzen 9 7950X 16-Core @ 4.5GHz", delay: 400 },
  { text: "[    0.120000] Initializing cgroup subsys cpuset", delay: 500 },
  { text: "[    0.200000] Security Framework initialized", delay: 650 },
  { text: "[    0.250000] AppArmor: AppArmor initialized", delay: 800 },
  { text: "[    0.300000] Mount-cache hash table entries: 65536", delay: 900 },
  { text: "[    0.400000] NET: Registered PF_INET protocol family", delay: 1050 },
  { text: "[    0.500000] systemd[1]: Detected architecture x86-64", delay: 1200 },
  { text: "[    0.600000] systemd[1]: Starting mamekuma.service...", delay: 1400 },
  { text: "[    0.700000] systemd[1]: Started mamekuma blog engine v2.0", delay: 1600 },
  { text: "", delay: 1750 },
  { text: "  ╔══════════════════════════════════════════╗", delay: 1850, class: "text-primary" },
  { text: "  ║     mamekuma@arch — system online 🐻     ║", delay: 1950, class: "text-primary font-bold" },
  { text: "  ╚══════════════════════════════════════════╝", delay: 2050, class: "text-primary" },
  { text: "", delay: 2150 },
  { text: "Welcome to mamekuma.sys — Loading interface...", delay: 2250, class: "text-primary" },
];

const BOOT_DURATION = 3000;

const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (sessionStorage.getItem("mamekuma-booted")) {
      onComplete();
      return;
    }

    bootLines.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(i + 1);
      }, line.delay);
    });

    // Progress bar animation
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const pct = Math.min((elapsed / BOOT_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(progressInterval);
    }, 30);

    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        sessionStorage.setItem("mamekuma-booted", "true");
        onComplete();
      }, 500);
    }, BOOT_DURATION);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  if (sessionStorage.getItem("mamekuma-booted")) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[200] bg-background flex flex-col justify-between p-6 md:p-12 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="font-mono text-xs md:text-sm leading-relaxed max-w-3xl w-full">
        {bootLines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={line.class || "text-muted-foreground"}>
            {line.text || "\u00A0"}
          </div>
        ))}
        <span className="inline-block w-2 h-4 bg-primary animate-blink ml-0.5" />
      </div>

      {/* Progress bar */}
      <div className="max-w-3xl w-full space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-muted-foreground">Loading mamekuma.sys</span>
          <span className="text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-sm overflow-hidden border border-border">
          <div
            className="h-full rounded-sm transition-[width] duration-75"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--terminal-cyan)))`,
              boxShadow: `0 0 8px hsl(var(--primary) / 0.5)`,
            }}
          />
        </div>
        <p className="text-[10px] font-mono text-muted-foreground">
          [{"\u2588".repeat(Math.round(progress / 2.5))}{"\u2591".repeat(40 - Math.round(progress / 2.5))}]
        </p>
      </div>
    </div>
  );
};

export default BootScreen;
