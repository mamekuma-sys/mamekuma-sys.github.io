import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import WindowCard from "@/components/WindowCard";
import Typewriter from "@/components/Typewriter";
import BlogPostCard from "@/components/BlogPostCard";
import ProjectCard from "@/components/ProjectCard";
import { posts, categories } from "@/data/posts";
import { projects } from "@/data/projects";
import { ArrowRight, Github, Mail } from "lucide-react";

const featuredProjects = projects.filter((p) => p.status === "shipped").slice(0, 3);

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative py-16 md:py-28 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-primary/30 bg-primary/5 mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-primary">STATUS: ONLINE — OPEN TO OPPORTUNITIES</span>
        </div>

        <div className="mb-4 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-bold font-mono leading-tight">
            <span className="text-primary">$</span> whoami<br />
            <span className="text-foreground">mamekuma</span> <span className="text-3xl md:text-5xl">🐻</span>
          </h1>
        </div>

        <div className="text-base md:text-lg text-muted-foreground font-mono h-8 mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Typewriter />
        </div>

        <div className="font-mono text-sm text-muted-foreground max-w-xl leading-relaxed mb-8 animate-slide-up space-y-1.5" style={{ animationDelay: "0.2s" }}>
          <p><span className="text-primary">→</span> 시스템 해킹을 바탕으로 보안을 이해하고,</p>
          <p><span className="text-primary">→</span> 직접 구현한 환경에서 취약점과 공격 흐름을 분석합니다.</p>
          <p><span className="text-primary">→</span> 최근에는 우주 및 항공 시스템 보안에 관심을 가지고 있습니다.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link
            to="/blog"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-sm text-sm font-mono font-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            $ cat blog <ArrowRight size={14} />
          </Link>
          <Link
            to="/projects"
            className="border border-border px-5 py-2.5 rounded-sm text-sm font-mono hover:border-primary hover:text-primary transition-colors"
          >
            $ ls projects/
          </Link>
          <a
            href="https://github.com/junny048"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border px-5 py-2.5 rounded-sm text-sm font-mono hover:border-primary hover:text-primary transition-colors inline-flex items-center gap-1.5"
          >
            <Github size={14} /> git clone
          </a>
        </div>
      </div>
    </section>

    {/* Recent Posts */}
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-bold font-mono">
          <span className="text-primary">$</span> ls ~/posts/ --recent
        </h2>
        <Link to="/blog" className="text-sm font-mono text-primary hover:underline inline-flex items-center gap-1">
          --all <ArrowRight size={14} />
        </Link>
      </div>
      <p className="text-sm font-mono text-muted-foreground mb-6">실험, 개발 로그, 기술 노트.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>

    {/* Categories */}
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-xl md:text-2xl font-bold font-mono mb-2">
        <span className="text-primary">$</span> tree ~/categories/
      </h2>
      <p className="text-sm font-mono text-muted-foreground mb-6">관심 분야별로 글을 탐색하세요.</p>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {categories.filter(c => c !== "All").map((cat) => (
          <Link
            key={cat}
            to={`/blog?category=${encodeURIComponent(cat)}`}
            className="group"
          >
            <WindowCard title={`${cat.toLowerCase().replace(/ /g, "_")}/`}>
              <div className="p-3 text-center">
                <span className="text-sm font-mono font-bold group-hover:text-primary transition-colors">{cat}</span>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  {posts.filter(p => p.category === cat).length} files
                </p>
              </div>
            </WindowCard>
          </Link>
        ))}
      </div>
    </section>

    {/* Featured Projects */}
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-bold font-mono">
          <span className="text-primary">$</span> ls ~/projects/ --shipped
        </h2>
        <Link to="/projects" className="text-sm font-mono text-primary hover:underline inline-flex items-center gap-1">
          --all <ArrowRight size={14} />
        </Link>
      </div>
      <p className="text-sm font-mono text-muted-foreground mb-6">직접 만들고, 실험하고, 배포한 프로젝트들.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>

    {/* About Preview */}
    <section className="container mx-auto px-4 py-12 max-w-3xl">
      <WindowCard title="about.md">
        <div className="p-6 md:p-8 font-mono">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-sm bg-primary/10 flex items-center justify-center text-2xl shrink-0 border border-primary/20">🐻</div>
            <div>
              <h3 className="text-base font-bold">
                mamekuma <span className="text-muted-foreground font-normal text-sm">// 이경준</span>
              </h3>
              <p className="text-xs text-primary">system_hacker | vibe_coder | security_analyst</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed mb-4 space-y-1.5">
            <p><span className="text-primary">→</span> 컴퓨터공학 전공, 아이디어를 코드로 만드는 과정을 기록합니다.</p>
            <p><span className="text-primary">→</span> 시스템 해킹 기반 보안 분석, 직접 구현한 환경에서 취약점 연구.</p>
            <p><span className="text-primary">→</span> 우주 및 항공 시스템 보안에 관심을 가지고 있습니다.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/about" className="text-sm text-primary font-bold hover:underline inline-flex items-center gap-1">
              $ cat about.md <ArrowRight size={13} />
            </Link>
            <a href="mailto:kjun04080@gmail.com" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <Mail size={13} /> kjun04080@gmail.com
            </a>
          </div>
        </div>
      </WindowCard>
    </section>
  </Layout>
);

export default Index;
