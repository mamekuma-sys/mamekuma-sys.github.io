import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { posts } from "@/data/posts";
import { ArrowLeft, Calendar, Clock, Tag, List } from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";

const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
      <div
        className="h-full transition-[width] duration-100 ease-out"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--terminal-cyan)))`,
        }}
      />
    </div>
  );
};

interface TocItem {
  level: number;
  text: string;
  id: string;
}

const TableOfContents = ({ items }: { items: TocItem[] }) => {
  const [open, setOpen] = useState(true);

  if (items.length === 0) return null;

  return (
    <nav className="mb-8 border border-border rounded-sm bg-card/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-4 py-3 text-xs font-mono font-semibold text-foreground hover:text-primary transition-colors"
      >
        <List size={14} />
        목차
        <span className="ml-auto text-muted-foreground text-[10px]">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <ul className="px-4 pb-3 space-y-1.5">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 16}px` }}>
              <a
                href={`#${item.id}`}
                className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors block py-0.5"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  const tocItems = useMemo(() => {
    if (!post?.content) return [];
    const items: TocItem[] = [];
    for (const line of post.content.split("\n")) {
      if (line.startsWith("### ")) {
        const text = line.slice(4);
        items.push({ level: 3, text, id: text.replace(/\s+/g, "-").toLowerCase() });
      } else if (line.startsWith("## ")) {
        const text = line.slice(3);
        items.push({ level: 2, text, id: text.replace(/\s+/g, "-").toLowerCase() });
      }
    }
    return items;
  }, [post]);

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center font-mono">
          <p className="text-xs text-primary mb-2">$ cat {slug}.md</p>
          <h1 className="text-lg font-bold mb-4">Error: file not found</h1>
          <Link to="/blog" className="text-xs text-primary hover:underline">
            $ cd ~/blog/
          </Link>
        </div>
      </Layout>
    );
  }

  const renderInlineFormatting = (text: string) => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[2]) {
        parts.push(<strong key={match.index} className="text-foreground font-semibold">{match[2]}</strong>);
      } else if (match[3]) {
        parts.push(<code key={match.index} className="text-xs font-mono px-1.5 py-0.5 rounded-sm bg-muted text-primary">{match[3]}</code>);
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLang = line.slice(3).trim();
          codeLines = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={i} className="my-5 rounded-sm border border-border overflow-hidden">
              {codeLang && (
                <div className="px-4 py-1.5 bg-muted/80 border-b border-border text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {codeLang}
                </div>
              )}
              <pre className="p-4 overflow-x-auto bg-muted/50">
                <code className="text-xs font-mono leading-relaxed text-foreground/80">
                  {codeLines.join("\n")}
                </code>
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Headings — no inline prefix, CSS ::before handles it via prose-custom
      if (line.startsWith("### ")) {
        const text = line.slice(4);
        const id = text.replace(/\s+/g, "-").toLowerCase();
        elements.push(
          <h3 key={i} id={id} className="text-base font-bold mt-8 mb-3 text-foreground font-mono scroll-mt-20">
            {text}
          </h3>
        );
        continue;
      }
      if (line.startsWith("## ")) {
        const text = line.slice(3);
        const id = text.replace(/\s+/g, "-").toLowerCase();
        elements.push(
          <h2 key={i} id={id} className="text-xl font-bold mt-10 mb-4 text-foreground font-mono scroll-mt-20">
            {text}
          </h2>
        );
        continue;
      }

      // Table
      if (line.startsWith("|")) {
        const cells = line.split("|").filter(Boolean).map(c => c.trim());
        if (cells.every(c => c.match(/^[-:]+$/))) continue;

        const isHeader = i + 1 < lines.length && lines[i + 1]?.startsWith("|") &&
          lines[i + 1].split("|").filter(Boolean).every(c => c.trim().match(/^[-:]+$/));

        elements.push(
          <div key={i} className={`grid gap-4 text-xs py-2 px-3 font-mono ${isHeader ? "font-bold text-foreground border-b border-border" : "text-muted-foreground"}`}
            style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
            {cells.map((cell, j) => (
              <span key={j}>{cell}</span>
            ))}
          </div>
        );
        continue;
      }

      // Ordered list
      if (line.match(/^\d+\.\s/)) {
        const text = line.replace(/^\d+\.\s/, "");
        elements.push(
          <li key={i} className="text-sm text-muted-foreground leading-relaxed ml-5 mb-2 list-decimal">
            {renderInlineFormatting(text)}
          </li>
        );
        continue;
      }

      // Unordered list
      if (line.startsWith("- ")) {
        elements.push(
          <li key={i} className="text-sm text-muted-foreground leading-relaxed ml-5 mb-2 list-disc">
            {renderInlineFormatting(line.slice(2))}
          </li>
        );
        continue;
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<div key={i} className="h-4" />);
        continue;
      }

      // Paragraph
      elements.push(
        <p key={i} className="text-sm text-muted-foreground leading-[1.8] mb-3">
          {renderInlineFormatting(line)}
        </p>
      );
    }

    return elements;
  };

  // Adjacent posts
  const currentIdx = posts.findIndex(p => p.slug === slug);
  const prevPost = currentIdx < posts.length - 1 ? posts[currentIdx + 1] : null;
  const nextPost = currentIdx > 0 ? posts[currentIdx - 1] : null;

  return (
    <Layout>
      <ReadingProgressBar />
      <article className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={14} /> 블로그로 돌아가기
        </Link>

        {/* Article header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[11px] font-mono font-semibold tracking-wide uppercase px-2 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
              <Calendar size={12} /> {post.date}
            </span>
            <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
              <Clock size={12} /> {post.readTime}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4 font-mono text-foreground">
            {post.title}
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Tag size={12} className="text-muted-foreground" />
              {post.tags.map((tag) => (
                <span key={tag} className="tag-pill text-[11px]">#{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Table of Contents */}
        <TableOfContents items={tocItems} />

        {/* Content */}
        <div className="prose-custom">
          {post.content ? renderContent(post.content) : (
            <p className="text-sm text-muted-foreground font-mono italic">
              콘텐츠 준비 중...
            </p>
          )}
        </div>

        {/* Post navigation */}
        <div className="border-t border-border mt-12 pt-6 grid grid-cols-2 gap-4">
          <div>
            {prevPost && (
              <Link to={`/blog/${prevPost.slug}`} className="group block">
                <span className="text-[10px] font-mono text-muted-foreground mb-1 block">← 이전 글</span>
                <span className="text-sm font-mono text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {prevPost.title}
                </span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {nextPost && (
              <Link to={`/blog/${nextPost.slug}`} className="group block">
                <span className="text-[10px] font-mono text-muted-foreground mb-1 block">다음 글 →</span>
                <span className="text-sm font-mono text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {nextPost.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
