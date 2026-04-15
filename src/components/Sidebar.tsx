import WindowCard from "./WindowCard";
import { categories } from "@/data/posts";
import { projects } from "@/data/projects";

const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();

const Sidebar = () => (
  <aside className="space-y-4">
    {/* Profile */}
    <WindowCard title="whoami">
      <div className="p-4 text-center font-mono">
        <div className="w-16 h-16 mx-auto mb-2 rounded-sm bg-primary/10 flex items-center justify-center text-2xl border border-primary/20">
          🐻
        </div>
        <h2 className="font-bold text-xs mb-1">mamekuma</h2>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          system_hacker<br />
          vibe_coder | security
        </p>
        <div className="mt-2 flex justify-center">
          <a
            href="https://github.com/junny048"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono text-primary hover:underline"
          >
            $ open github →
          </a>
        </div>
      </div>
    </WindowCard>

    {/* Categories */}
    <WindowCard title="ls categories/">
      <div className="p-3 font-mono">
        <ul className="space-y-1">
          {categories.filter((c) => c !== "All").map((cat) => (
            <li key={cat} className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <span className="text-primary mr-1.5">├──</span>
              <span>{cat.toLowerCase().replace(/ /g, "_")}/</span>
            </li>
          ))}
        </ul>
      </div>
    </WindowCard>

    {/* Tags */}
    <WindowCard title="grep tags *">
      <div className="p-3">
        <div className="flex flex-wrap gap-1">
          {allTags.slice(0, 16).map((tag) => (
            <span key={tag} className="tag-pill text-[10px]">{tag}</span>
          ))}
        </div>
      </div>
    </WindowCard>
  </aside>
);

export default Sidebar;
