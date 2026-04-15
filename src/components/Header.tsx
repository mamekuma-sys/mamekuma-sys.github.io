import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  { label: "~/home", path: "/" },
  { label: "~/blog", path: "/blog" },
  { label: "~/projects", path: "/projects" },
  { label: "~/about", path: "/about" },
  { label: "~/contact", path: "/contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-1.5 group">
          <span className="text-primary font-mono font-bold text-base">mamekuma</span>
          <span className="text-muted-foreground font-mono text-sm">@arch</span>
          <span className="text-primary font-mono text-base">:~$</span>
          <span className="w-2 h-5 bg-primary animate-blink inline-block ml-0.5" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-mono px-3 py-1.5 rounded-sm transition-colors ${
                location.pathname === item.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/junny048"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono px-3 py-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            git ↗
          </a>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-sm text-muted-foreground hover:text-primary transition-colors ml-1"
            aria-label="Toggle theme"
          >
            <Sun size={16} className="hidden dark:block" />
            <Moon size={16} className="block dark:hidden" />
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle theme"
          >
            <Sun size={16} className="hidden dark:block" />
            <Moon size={16} className="block dark:hidden" />
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 text-foreground" aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`text-sm font-mono py-2 px-3 rounded-sm ${
                  location.pathname === item.path ? "text-primary bg-primary/10" : "text-muted-foreground"
                }`}
              >
                <span className="text-primary mr-1">$</span> cd {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/junny048"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono py-2 px-3 text-muted-foreground"
            >
              <span className="text-primary mr-1">$</span> open github ↗
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
