import { ProgressIndicator } from './components/layout/ProgressIndicator'
import { HeroSection } from './components/chapters/HeroSection'
import { LLMFoundation } from './components/chapters/LLMFoundation'
import { ViTConnector } from './components/chapters/ViTConnector'
import { LoraExplainer } from './components/chapters/LoraExplainer'
import { VLMPlayground } from './components/chapters/VLMPlayground'
import { useActiveChapter, useScrollProgress } from './hooks/useScrollProgress'

function App() {
  const activeIndex = useActiveChapter()
  const scrollProgress = useScrollProgress()

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200">
      <ProgressIndicator activeIndex={activeIndex} scrollProgress={scrollProgress} />

      <main>
        <HeroSection />
        <LLMFoundation />
        <ViTConnector />
        <LoraExplainer />
        <VLMPlayground />
      </main>
    </div>
  )
}

export default App
