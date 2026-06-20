import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { marked } from 'marked'
import { getBlogBySlug, BLOG_POSTS } from '@/data/blogs'

const MB: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [html, setHtml] = useState('')

  const post = getBlogBySlug(slug ?? '')

  useEffect(() => {
    if (!post) return
    const result = marked.parse(post.content)
    if (typeof result === 'string') setHtml(result)
    else result.then(setHtml)
    window.scrollTo(0, 0)
  }, [post])

  if (!post) return <Navigate to="/blog" replace />

  const related = BLOG_POSTS.filter(p => p.slug !== post.slug && p.tags.some(t => post.tags.includes(t))).slice(0, 2)

  return (
    <div className="min-h-screen bg-black pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: MB }}
          className="mb-12"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-silver-600 hover:text-white transition-colors duration-200"
          >
            <span>&larr;</span> All Posts
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: MB }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map(tag => (
              <span key={tag} className="text-[10px] font-mono tracking-widest uppercase text-silver-600 border border-white/[0.07] px-2.5 py-1">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-silver-400 font-light text-lg leading-relaxed mb-8">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-6 text-[11px] font-mono text-silver-700 pb-8 border-b border-white/[0.06]">
            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>{post.readTime} min read</span>
            <span>Kartik Sonawane</span>
          </div>
        </motion.header>

        {/* Cover image */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: MB }}
            className="mb-12 overflow-hidden border border-white/[0.06]"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-56 sm:h-72 object-cover opacity-75"
            />
          </motion.div>
        )}

        {/* Body */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: MB }}
          className="prose-mercedes"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Related posts */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: MB }}
            className="mt-20 pt-12 border-t border-white/[0.06]"
          >
            <p className="section-label mb-8">Related</p>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map(r => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="group border border-white/[0.06] p-6 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {r.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] font-mono tracking-widest uppercase text-silver-700">{t}</span>
                    ))}
                  </div>
                  <h3 className="font-display text-lg text-white group-hover:text-silver-100 transition-colors leading-snug mb-2">
                    {r.title}
                  </h3>
                  <p className="text-[11px] font-mono text-silver-700">{r.readTime} min read &rarr;</p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}
