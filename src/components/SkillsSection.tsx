import WindowCard from "./WindowCard";

interface SkillBarProps {
  name: string;
  level: number;
}

const SkillBar = ({ name, level }: SkillBarProps) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-mono">
      <span>{name}</span>
      <span className="text-muted-foreground">{level}%</span>
    </div>
    <div className="h-1.5 bg-muted rounded-sm overflow-hidden">
      <div
        className="h-full rounded-sm animate-progress-fill"
        style={{
          "--progress-width": `${level}%`,
          width: `${level}%`,
          background: `hsl(var(--primary))`,
        } as React.CSSProperties}
      />
    </div>
  </div>
);

const skills = {
  "AI & Development": [
    { name: "Python", level: 85 },
    { name: "React / TypeScript", level: 80 },
    { name: "Machine Learning", level: 70 },
    { name: "LLM / API Integration", level: 75 },
  ],
  "Security & Systems": [
    { name: "Network Security", level: 65 },
    { name: "System Programming (C/C++)", level: 70 },
    { name: "Secure Development", level: 60 },
    { name: "Linux Administration", level: 65 },
  ],
  "Tools & Platforms": [
    { name: "Git / GitHub", level: 85 },
    { name: "Supabase / Firebase", level: 75 },
    { name: "Lovable / Vibe Coding", level: 90 },
    { name: "Jupyter Notebook", level: 80 },
  ],
};

const SkillsSection = () => (
  <section id="skills" className="container mx-auto px-4 py-12">
    <h2 className="text-lg md:text-xl font-bold font-mono mb-1">
      <span className="text-primary">$</span> cat /proc/skills
    </h2>
    <p className="text-xs font-mono text-muted-foreground mb-6">// 프로젝트와 학습을 통해 쌓아온 기술들</p>
    <div className="grid gap-4 md:grid-cols-3">
      {Object.entries(skills).map(([category, items]) => (
        <WindowCard key={category} title={`${category.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_")}.conf`}>
          <div className="p-4 space-y-3">
            <h3 className="font-bold text-xs font-mono">
              <span className="text-primary">$</span> {category}
            </h3>
            {items.map((skill) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} />
            ))}
          </div>
        </WindowCard>
      ))}
    </div>
  </section>
);

export default SkillsSection;
