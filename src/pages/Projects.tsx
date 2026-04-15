import { useState } from "react";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const filters = ["All", "GitHub", "Lovable"];

const Projects = () => {
  const [active, setActive] = useState("All");
  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.source === active.toLowerCase());

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl md:text-2xl font-bold font-mono mb-1">
          <span className="text-primary">$</span> ls ~/projects/
        </h1>
        <p className="text-muted-foreground text-xs font-mono mb-6">
          // 직접 만들고, 실험하고, 배포한 것들.
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`tag-pill text-[11px] ${
                active === f ? "border-primary text-primary bg-primary/5" : ""
              }`}
            >
              {f === "All" ? "--all" : `--source=${f.toLowerCase()}`}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
