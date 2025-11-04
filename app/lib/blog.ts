import fs from "fs";
import path from "path";
import matter from "gray-matter";

const logsDirectory = path.join(process.cwd(), "log_entries");

export interface BlogPost {
  id: string;
  title: string;
  date?: string;
  content: string;
  excerpt: string;
}

export function getAllBlogPosts(): BlogPost[] {
  const files = fs.readdirSync(logsDirectory);
  const posts = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(logsDirectory, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      // Extract first line as title if not in frontmatter
      const title = data.title || extractTitle(content) || file;
      const excerpt =
        data.excerpt || extractExcerpt(content, 150) || "Read more...";

      return {
        id: file.replace(/\.md$/, ""),
        title,
        date: data.date,
        content,
        excerpt,
      };
    })
    .sort((a, b) => {
      // Sort by filename in reverse order (assuming numeric filenames)
      const aNum = parseInt(a.id) || 0;
      const bNum = parseInt(b.id) || 0;
      return bNum - aNum;
    });

  return posts;
}

export function getBlogPost(id: string): BlogPost | null {
  const filePath = path.join(logsDirectory, `${id}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const title = data.title || extractTitle(content) || `${id}.md`;
  const excerpt = data.excerpt || extractExcerpt(content, 150) || "Read more...";

  return {
    id,
    title,
    date: data.date,
    content,
    excerpt,
  };
}

function extractTitle(content: string): string {
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.startsWith("#")) {
      return line.replace(/^#+\s*/, "").trim();
    }
  }
  return "";
}

function extractExcerpt(content: string, length: number): string {
  const text = content
    .replace(/#+\s*/g, "") // Remove headers
    .replace(/[*_]/g, "") // Remove markdown formatting
    .replace(/\n/g, " ") // Replace newlines with spaces
    .trim();
  return text.substring(0, length) + (text.length > length ? "..." : "");
}
