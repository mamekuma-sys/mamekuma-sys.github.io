import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import BlogPostCard from "@/components/BlogPostCard";
import { posts, categories } from "@/data/posts";
import { X, Search } from "lucide-react";

const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || []))).sort();

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [active, setActive] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let result = posts;
    if (active !== "All") {
      result = result.filter((p) => p.category === active);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }
    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.some((tag) => p.tags?.includes(tag))
      );
    }
    return result;
  }, [active, search, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCategoryChange = (cat: string) => {
    setActive(cat);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-mono mb-2">
            <span className="text-primary">~/</span>blog
          </h1>
          <p className="text-sm text-muted-foreground">
            실험, 개발 로그, 그리고 기술 노트.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="w-full bg-card border border-border rounded-sm pl-10 pr-8 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-xs font-mono px-3 py-1 border rounded-sm transition-all duration-200 ${
                active === cat
                  ? "border-primary text-primary bg-primary/10 font-semibold"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {cat}
              <span className="ml-1 opacity-50">
                ({cat === "All" ? posts.length : posts.filter((p) => p.category === cat).length})
              </span>
            </button>
          ))}
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-[11px] font-mono px-2 py-0.5 border rounded-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? "border-primary text-primary bg-primary/10"
                    : "border-transparent text-muted-foreground hover:text-primary hover:border-primary/30"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="text-xs text-muted-foreground mb-5">
          {filtered.length}개의 글{search && ` — "${search}" 검색 결과`}
        </p>

        {/* Post list */}
        <div className="space-y-4">
          {filtered.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-muted-foreground mb-3">
                검색 결과가 없습니다.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActive("All");
                  setSelectedTags([]);
                }}
                className="text-sm text-primary hover:underline font-mono"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
