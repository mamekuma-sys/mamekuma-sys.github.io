import { Link } from "react-router-dom";
import type { Post } from "@/data/posts";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const BlogPostCard = ({ post }: { post: Post }) => (
  <Link to={`/blog/${post.slug}`} className="block group">
    <article className="bg-card border border-border rounded-sm p-5 md:p-6 card-hover transition-all duration-200">
      {/* Category badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono font-semibold tracking-wide uppercase px-2 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20">
          {post.category}
        </span>
        <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.readTime}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold mb-2 leading-snug group-hover:text-primary transition-colors font-mono">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {post.excerpt}
      </p>

      {/* Footer: Tags + Read more */}
      <div className="flex items-center justify-between">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-pill text-[10px]">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <span className="text-xs text-primary font-mono flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
          Read <ArrowRight size={12} />
        </span>
      </div>
    </article>
  </Link>
);

export default BlogPostCard;
