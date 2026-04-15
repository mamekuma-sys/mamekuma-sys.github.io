import Layout from "@/components/Layout";
import WindowCard from "@/components/WindowCard";
import { Code2, Shield, Rocket, Lightbulb } from "lucide-react";

const focuses = [
  { icon: Code2, label: "AI & Machine Learning", desc: "LLM 활용 프로덕트 개발, ML 파이프라인, 빠른 AI MVP 프로토타이핑." },
  { icon: Shield, label: "Cybersecurity", desc: "보안 모범 사례 연구, 인증 플로우 분석, 안전한 개발 습관." },
  { icon: Rocket, label: "Space Technology", desc: "우주 보안, 위성 시스템, 미래 인프라 사이버 위협 탐색." },
  { icon: Lightbulb, label: "Startup Building", desc: "MVP 기획·출시, 사용자 검증, 프로덕트 씽킹 실천." },
];

const techStack = [
  "Python", "JavaScript", "TypeScript", "React", "C", "C++",
  "Supabase", "Jupyter", "TailwindCSS", "Git", "Lovable",
];

const About = () => (
  <Layout>
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold font-mono mb-1">
        <span className="text-primary">$</span> cat ~/about.md
      </h1>
      <p className="text-sm font-mono text-muted-foreground mb-8">// personal info loaded</p>

      <WindowCard title="README.md" className="mb-6">
        <div className="p-6 space-y-3 text-sm md:text-base font-mono text-muted-foreground leading-relaxed">
          <p><span className="text-primary">→</span> 안녕하세요, 바이브코딩을 기반으로 빠르게 만들고 실험하는 개발자입니다.</p>
          <p><span className="text-primary">→</span> 컴퓨터공학을 전공하며 아이디어를 코드로 만드는 과정을 기록합니다.</p>
          <p><span className="text-primary">→</span> 시스템 해킹을 바탕으로 보안을 이해하고, 취약점과 공격 흐름을 분석합니다.</p>
          <p><span className="text-primary">→</span> 우주 및 항공 시스템 보안에 관심을 가지고 있습니다.</p>
        </div>
      </WindowCard>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {focuses.map((item) => (
          <WindowCard key={item.label} title={`${item.label.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_")}.conf`}>
            <div className="p-5 font-mono">
              <div className="flex items-center gap-2 mb-2">
                <item.icon size={16} className="text-primary" />
                <h3 className="font-bold text-sm md:text-base">{item.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </WindowCard>
        ))}
      </div>

      <WindowCard title="pacman -Q">
        <div className="p-5">
          <h3 className="font-bold text-sm md:text-base mb-4 font-mono">
            <span className="text-primary">$</span> installed packages:
          </h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span key={tech} className="tag-pill text-sm">{tech}</span>
            ))}
          </div>
        </div>
      </WindowCard>
    </div>
  </Layout>
);

export default About;
