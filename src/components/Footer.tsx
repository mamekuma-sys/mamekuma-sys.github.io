const Footer = () => (
  <footer className="border-t border-border py-6 mt-16">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
      <p className="text-xs font-mono text-muted-foreground">
        <span className="text-primary">$</span> echo "© 2026 mamekuma" <span className="text-muted-foreground/60">| built with curiosity && caffeine</span>
      </p>
      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
        <a
          href="https://github.com/junny048"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          github
        </a>
        <span className="text-border">|</span>
        <a href="mailto:kjun04080@gmail.com" className="hover:text-primary transition-colors">
          mail
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
