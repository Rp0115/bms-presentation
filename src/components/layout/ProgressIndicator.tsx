import { motion } from 'framer-motion'
import { CHAPTERS } from '../../data/chapters'

interface ProgressIndicatorProps {
  activeIndex: number
  scrollProgress: number
}

export function ProgressIndicator({ activeIndex, scrollProgress }: ProgressIndicatorProps) {
  const scrollToChapter = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Side navigation dots */}
      <nav
        className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-4 md:flex"
        aria-label="Chapter navigation"
      >
        {CHAPTERS.map((chapter, i) => (
          <button
            key={chapter.id}
            onClick={() => scrollToChapter(chapter.id)}
            className="group flex items-center gap-3"
            aria-label={`Go to Chapter ${chapter.number}: ${chapter.label}`}
            aria-current={i === activeIndex ? 'true' : undefined}
          >
            <span
              className={`text-right text-xs font-medium transition-all duration-300 ${
                i === activeIndex
                  ? 'opacity-100 text-neon-cyan'
                  : 'opacity-0 group-hover:opacity-70 text-slate-400'
              }`}
            >
              {chapter.label}
            </span>
            <motion.div
              className={`rounded-full border transition-colors duration-300 ${
                i === activeIndex
                  ? 'border-neon-cyan bg-neon-cyan/20'
                  : 'border-slate-600 bg-transparent group-hover:border-slate-400'
              }`}
              animate={{
                width: i === activeIndex ? 12 : 8,
                height: i === activeIndex ? 12 : 8,
              }}
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
      </nav>

      {/* Mobile chapter indicator */}
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 md:hidden">
        <div className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 backdrop-blur-md">
          <span className="text-xs font-mono text-neon-cyan">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-xs text-slate-500">/</span>
          <span className="text-xs font-mono text-slate-500">
            {String(CHAPTERS.length).padStart(2, '0')}
          </span>
          <span className="ml-2 text-xs text-slate-300">{CHAPTERS[activeIndex].label}</span>
        </div>
      </div>
    </>
  )
}
