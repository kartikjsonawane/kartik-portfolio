import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BLOG_POSTS } from '@/data/blogs'

const MB: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Blog() {
  const [activeTag, setActiveTag] = useState('')

  const allTags = Array.from(new Set(BLOG_POSTS.flatMap(p => p.tags))).slice(0, 12)
  const posts = activeTag ? BLOG_POSTS.filter(p => p.tags.includes(activeTag)) : BLOG_POSTS

  return (
    <div className="min-h-screen bg-black pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: MB }}
          className="mb-16"
        >
          <p className="section-label mb-4">Writing</p>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-5">
            Technical Notes
          </h1>
          <p className="text-silver-500 font-light text-lg max-w-xl">
            Deep dives into AI/ML engineering, Android development, and full-stack architecture.
          </p>
        </motion.div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap gap-2 mb-12"
          >
            <button
              onClick={() => setActiveTag('')}
              className={`px-3 py-1 text-[11px] font-mono tracking-widest uppercase transition-all duration-200 border ${
                activeTag === ''
                  ? 'bg-white text-black border-white'
                  : 'border-white/10 text-silver-500 hover:border-white/30 hover:text-white'
              }`}
            >
              All
            </button>
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setActiveTag(t === activeTag ? '' : t)}
                className={`px-3 py-1 text-[11px] font-mono tracking-widest uppercase transition-all duration-200 border ${
                  activeTag === t
                    ? 'bg-white text-black border-white'
                    : 'border-white/10 text-silver-500 hover:border-white/30 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </motion.div>
        )}

        {/* Post list */}
        <div className="space-y-0">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.6, ease: MB }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block border-t border-white/[0.06] py-8 hover:bg-white/[0.02] transition-colors duration-300 px-4 -mx-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
                  {/* Cover image */}
                  {post.coverImage && (
                    <div className="w-full sm:w-36 h-24 sm:h-24 shrink-0 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-mono tracking-widest uppercase text-silver-600">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="font-display text-xl sm:text-2xl text-white mb-2 group-hover:text-silver-100 transition-colors duration-300 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-silver-500 font-light text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-silver-700">
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span>{post.readTime} min read</span>
                      <span className="ml-auto text-white/0 group-hover:text-silver-400 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                        Read &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-20 text-center text-silver-600 font-mono text-sm tracking-widest">
            No posts for this tag.
          </div>
        )}

      </div>
    </div>
  )
}
