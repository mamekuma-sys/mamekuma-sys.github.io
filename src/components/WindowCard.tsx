import { ReactNode } from "react";

interface WindowCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const WindowCard = ({ title, children, className = "" }: WindowCardProps) => (
  <div className={`terminal-card ${className}`}>
    <div className="terminal-bar">
      <div className="terminal-dot terminal-dot-red" />
      <div className="terminal-dot terminal-dot-yellow" />
      <div className="terminal-dot terminal-dot-green" />
      <span className="terminal-title">
        <span className="text-primary">~</span>/{title}
      </span>
    </div>
    <div>{children}</div>
  </div>
);

export default WindowCard;
