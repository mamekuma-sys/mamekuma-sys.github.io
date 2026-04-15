import { useState, useEffect } from "react";

const commands = [
  "root@mamekuma:~# ./system_hacker",
  "root@mamekuma:~# cat /etc/exploit.conf",
  "root@mamekuma:~# nmap -sV target.space",
  "root@mamekuma:~# ./vibe_coder --mode=build",
  "root@mamekuma:~# tail -f /var/log/security",
];

const Typewriter = () => {
  const [cmdIndex, setCmdIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = commands[cmdIndex];
    const speed = deleting ? 30 : 60;

    if (!deleting && text === current) {
      const timeout = setTimeout(() => setDeleting(true), 2500);
      return () => clearTimeout(timeout);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setCmdIndex((prev) => (prev + 1) % commands.length);
      return;
    }

    const timeout = setTimeout(() => {
      setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, cmdIndex]);

  return (
    <span className="text-primary font-mono">
      {text}
      <span className="animate-blink">█</span>
    </span>
  );
};

export default Typewriter;
