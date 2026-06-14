import { useEffect, useState } from 'react'
import { CHAPTERS } from '../data/chapters'

function getSectionTops(): { id: string; top: number }[] {
  return CHAPTERS.map((chapter) => {
    const el = document.getElementById(chapter.id)
    return {
      id: chapter.id,
      top: el ? el.getBoundingClientRect().top + window.scrollY : 0,
    }
  })
}

export function useActiveChapter() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const updateActive = () => {
      const sections = getSectionTops()
      if (sections.length === 0) return

      const scrollBottom = window.scrollY + window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      // Snap to last chapter when scrolled to the bottom
      if (scrollBottom >= docHeight - 2) {
        setActiveIndex(sections.length - 1)
        return
      }

      // Reference point ~35% down the viewport — feels natural while reading
      const reference = window.scrollY + window.innerHeight * 0.35

      let idx = 0
      for (let i = 0; i < sections.length; i++) {
        if (reference >= sections[i].top) {
          idx = i
        }
      }

      setActiveIndex(idx)
    }

    // Wait one frame so layout (fonts, images) has settled before measuring
    const raf = requestAnimationFrame(updateActive)

    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [])

  return activeIndex
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}
