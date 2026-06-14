import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface MathBlockProps {
  title?: string
  children: ReactNode
  className?: string
  delay?: number
}

export function MathBlock({ title, children, className = '', delay = 0 }: MathBlockProps) {
  return (
    <motion.div
      className={`rounded-xl border border-slate-700/50 bg-slate-950/70 p-5 md:p-6 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
    >
      {title && (
        <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
          {title}
        </div>
      )}
      <div className="font-mono text-sm leading-relaxed text-slate-200 md:text-base">
        {children}
      </div>
    </motion.div>
  )
}

interface ProseBlockProps {
  title?: string
  children: ReactNode
  delay?: number
}

export function ProseBlock({ title, children, delay = 0 }: ProseBlockProps) {
  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
    >
      {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
      <div className="space-y-3 text-base leading-relaxed text-slate-400">{children}</div>
    </motion.div>
  )
}
