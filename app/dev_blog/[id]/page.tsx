import Link from "next/link";
import { getBlogPost, getAllBlogPosts } from "../../lib/blog";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-200">
      {/* Header */}
      <div className="bg-gradient-to-b from-stone-950 to-stone-900 border-b border-stone-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/dev_blog">
            <button className="px-4 py-2 mb-6 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors">
              ← Back to Blog
            </button>
          </Link>

          <h1 className="text-5xl font-bold mb-2">{post.title}</h1>
          {post.date && (
            <time className="text-stone-400">Published: {post.date}</time>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        <article className="prose prose-invert max-w-none">
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-2xl font-bold mt-5 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-stone-300 mb-4 leading-relaxed" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    className="list-disc list-inside mb-4 text-stone-300 space-y-2"
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="list-decimal list-inside mb-4 text-stone-300 space-y-2"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-stone-300" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-cyan-700 pl-4 italic text-stone-400 my-4"
                    {...props}
                  />
                ),
                code: ({ node, ...props }: any) =>
                  props.inline ? (
                    <code
                      className="bg-stone-800 px-2 py-1 rounded text-cyan-300"
                      {...props}
                    />
                  ) : (
                    <code
                      className="block bg-stone-800 p-4 rounded mb-4 text-cyan-300 overflow-x-auto"
                      {...props}
                    />
                  ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-cyan-400 hover:text-cyan-300 underline"
                    {...props}
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </main>
  );
}
