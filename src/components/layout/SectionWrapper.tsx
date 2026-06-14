import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionWrapperProps {
  id: string
  chapterNumber: number
  chapterTitle: string
  children: ReactNode
  className?: string
}

export function SectionWrapper({
  id,
  chapterNumber,
  chapterTitle,
  children,
  className = '',
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative min-h-screen w-full overflow-hidden px-6 py-24 pb-32 md:px-12 lg:px-20 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />

      <motion.div
        className="relative z-10 mx-auto max-w-6xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-12 flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-sm text-neon-cyan">
            CHAPTER {String(chapterNumber).padStart(2, '0')}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-neon-cyan/50 to-transparent" />
          <span className="text-sm text-slate-500">{chapterTitle}</span>
        </motion.div>

        {children}
      </motion.div>
    </section>
  )
}
