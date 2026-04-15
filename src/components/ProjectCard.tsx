import WindowCard from "./WindowCard";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/data/projects";

const statusStyles = {
  shipped: "text-primary",
  "in-progress": "text-yellow-500",
  experiment: "text-muted-foreground",
};

const statusLabels = {
  shipped: "[DEPLOYED]",
  "in-progress": "[BUILDING]",
  experiment: "[TESTING]",
};

const ProjectCard = ({ project }: { project: Project }) => (
  <WindowCard title={`${project.title.toLowerCase().replace(/ /g, "_")}.sh`} className="card-hover">
    <div className="p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-mono font-bold ${statusStyles[project.status]}`}>
          {statusLabels[project.status]}
        </span>
        <div className="flex items-center gap-2">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github size={14} />
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
      <h3 className="text-base font-bold mb-2 font-mono">{project.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-1 font-mono">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="tag-pill text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </WindowCard>
);

export default ProjectCard;
