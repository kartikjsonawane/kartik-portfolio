import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiStar, FiGitCommit, FiUsers } from 'react-icons/fi'
import axios from 'axios'

interface GitHubData {
  public_repos: number
  followers: number
  following: number
  name: string
}

interface GitHubStatsProps { username: string }

export default function GitHubStats({ username }: GitHubStatsProps) {
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`https://api.github.com/users/${username}`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [username])

  const stats = [
    { label: 'Public Repos', value: data?.public_repos ?? '—', icon: FiGithub },
    { label: 'Followers',    value: data?.followers ?? '—',    icon: FiUsers },
    { label: 'Following',    value: data?.following ?? '—',    icon: FiUsers },
    { label: 'Commits (est)', value: '500+',                    icon: FiGitCommit },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-white/10 bg-surface-2 p-5"
          >
            <stat.icon className="w-4 h-4 text-accent-500 mb-3" />
            <p className="text-2xl font-bold text-white">
              {loading ? <span className="animate-pulse text-neutral-700">—</span> : stat.value}
            </p>
            <p className="text-xs text-neutral-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* GitHub Card Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-surface-2 hover:border-accent-500/30 transition-all"
        >
          <FiGithub className="w-5 h-5 text-neutral-500 group-hover:text-accent-400 transition-colors" />
          <div>
            <p className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">@{username}</p>
            <p className="text-xs text-neutral-600">GitHub Profile</p>
          </div>
        </a>

        {/* Contribution image from GitHub */}
        <div className="p-4 rounded-xl border border-white/10 bg-surface-2 overflow-hidden">
          <p className="text-xs text-neutral-600 mb-2 font-mono">Contribution graph</p>
          <img
            src={`https://ghchart.rshah.org/10b981/${username}`}
            alt="GitHub contribution graph"
            className="w-full rounded opacity-80"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      </div>
    </div>
  )
}
