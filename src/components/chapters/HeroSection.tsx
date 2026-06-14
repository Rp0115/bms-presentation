import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { SectionWrapper } from '../layout/SectionWrapper'
import { MathBlock, ProseBlock } from '../ui/MathBlock'
import { MatrixChain } from '../ui/MatrixViz'

function BridgeDiagram() {
  return (
    <svg viewBox="0 0 800 400" className="w-full max-w-3xl" aria-hidden="true">
      <defs>
        <linearGradient id="pixelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="wordGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>

      <motion.g
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <rect x="40" y="80" width="200" height="240" rx="12" fill="#1a2235" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.5" />
        <text x="140" y="60" textAnchor="middle" fill="#22d3ee" fontSize="14" fontFamily="monospace">PIXELS</text>
        {Array.from({ length: 64 }).map((_, i) => {
          const row = Math.floor(i / 8)
          const col = i % 8
          const opacity = 0.2 + ((i * 7 + 3) % 10) * 0.06
          return (
            <motion.rect
              key={i}
              x={60 + col * 22}
              y={100 + row * 22}
              width="18"
              height="18"
              rx="2"
              fill="url(#pixelGrad)"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.02 }}
            />
          )
        })}
        <text x="140" y="340" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">{'X ∈ ℝ^(H×W×3)'}</text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <rect x="560" y="80" width="200" height="240" rx="12" fill="#1a2235" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.5" />
        <text x="660" y="60" textAnchor="middle" fill="#a78bfa" fontSize="14" fontFamily="monospace">WORDS</text>
        {['The', 'cat', 'sits', 'on', 'a', 'red', 'mat', '.'].map((word, i) => (
          <motion.text
            key={word}
            x="660"
            y={120 + i * 28}
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="16"
            fontFamily="monospace"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
          >
            {word}
          </motion.text>
        ))}
        <text x="660" y="340" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">T = (t₁, t₂, …, tₙ)</text>
      </motion.g>

      <motion.g
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 1.2, ease: 'easeInOut' }}
      >
        <motion.path
          d="M 250 200 Q 400 80 550 200"
          fill="none"
          stroke="url(#bridgeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 1.2 }}
        />
        <motion.path
          d="M 250 200 Q 400 320 550 200"
          fill="none"
          stroke="url(#bridgeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="0.4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 1.4 }}
        />
        <motion.text
          x="400"
          y="195"
          textAnchor="middle"
          fill="#fbbf24"
          fontSize="13"
          fontFamily="monospace"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2 }}
        >
          f_θ : 𝒱 → ℒ
        </motion.text>
      </motion.g>

      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          r="4"
          fill={i === 0 ? '#22d3ee' : i === 1 ? '#a78bfa' : '#f472b6'}
          initial={{ cx: 250, cy: 200, opacity: 0 }}
          animate={{
            cx: [250, 400, 550],
            cy: [200, i === 1 ? 80 : 320, 200],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: 2.5 + i * 0.8,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  )
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.8], [0, -60])

  return (
    <SectionWrapper id="vision" chapterNumber={1} chapterTitle="The Vision">
      <motion.div ref={ref} style={{ opacity, scale, y }}>
        <motion.h1
          className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-gradient">Vision-Language</span>
          <br />
          <span className="text-white">Models</span>
        </motion.h1>

        <motion.p
          className="mb-8 max-w-3xl text-lg text-slate-400 md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Multimodal neural networks that jointly process visual and textual inputs —
          learning a shared representation where images and language inhabit the same mathematical space.
        </motion.p>

        <BridgeDiagram />

        <div className="mt-16 space-y-10">
          <ProseBlock title="What is a Vision-Language Model?" delay={0.1}>
            <p>
              A <strong className="text-slate-200">Vision-Language Model (VLM)</strong> is a deep
              learning architecture that accepts both an image <em>X</em> and a text sequence{' '}
              <em>T</em> as input, then produces a textual response <em>Y</em>. Unlike unimodal
              systems — a CNN that only classifies objects, or an LLM that only processes text — a
              VLM learns cross-modal alignments: it understands that the pixel pattern in region{' '}
              <em>(i, j)</em> of an image corresponds semantically to the word &quot;cat.&quot;
            </p>
            <p>
              Modern VLMs like LLaVA, GPT-4V, and Gemini achieve this by grafting a{' '}
              <strong className="text-cyan-400">vision encoder</strong> (typically a Vision
              Transformer) onto a pre-trained{' '}
              <strong className="text-violet-400">Large Language Model</strong>, connected by a
              learned projection layer. The LLM never sees raw pixels — it sees{' '}
              <em>visual tokens</em> that have been transformed into the same d-dimensional vector
              space as word embeddings.
            </p>
          </ProseBlock>

          <MathBlock title="Formal Definition" delay={0.2}>
            <div className="space-y-4">
              <div>
                <span className="text-slate-500"># Input spaces</span>
                <div className="mt-1">
                  <span className="text-cyan-400">X</span> ∈ ℝ
                  <sup className="text-xs">H×W×3</sup>{' '}
                  <span className="text-slate-500">(image tensor)</span>
                </div>
                <div>
                  <span className="text-violet-400">T</span> = (t₁, t₂, …, tₙ){' '}
                  <span className="text-slate-500">(token sequence)</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500"># VLM as conditional generative model</span>
                <div className="mt-1 text-lg">
                  <span className="text-amber-400">P</span>(Y | X, T; θ) = ∏
                  <sub className="text-xs">i=1</sub>
                  <sup className="text-xs">|Y|</sup>{' '}
                  <span className="text-amber-400">P</span>(yᵢ | y
                  <sub className="text-xs">&lt;i</sub>,{' '}
                  <span className="text-cyan-400">f<sub>enc</sub>(X)</span>, T; θ)
                </div>
              </div>
              <div className="text-sm text-slate-500">
                where f<sub>enc</sub> is the vision encoder + projection pipeline, mapping pixels →
                visual token embeddings ∈ ℝ<sup>d</sup>
              </div>
            </div>
          </MathBlock>

          <ProseBlock title="The Two Worlds Problem" delay={0.3}>
            <p>
              Images live in a <strong className="text-cyan-400">continuous, high-dimensional
              spatial grid</strong>: each pixel is a tuple (R, G, B) ∈ [0, 255]³, and spatial
              locality matters — adjacent pixels are correlated. Language lives in a{' '}
              <strong className="text-violet-400">discrete, sequential symbolic space</strong>: tokens
              are drawn from a finite vocabulary V, and order carries syntactic and semantic meaning.
            </p>
            <p>
              These modalities have fundamentally different structures. A VLM&apos;s central
              engineering challenge is building a differentiable bridge — a function f<sub>θ</sub>{' '}
              that maps visual information into the LLM&apos;s latent space ℒ ⊂ ℝ<sup>d</sup> such
              that downstream attention mechanisms can treat visual and textual tokens uniformly.
            </p>
          </ProseBlock>

          <MathBlock title="The Unified Token Sequence" delay={0.4}>
            <div className="space-y-3">
              <div>
                <span className="text-pink-400">Z</span> = [
                <span className="text-cyan-400">z₁<sup>vis</sup></span>,{' '}
                <span className="text-cyan-400">z₂<sup>vis</sup></span>, …,{' '}
                <span className="text-cyan-400">z<sub>M</sub><sup>vis</sup></span>,{' '}
                <span className="text-violet-400">z₁<sup>txt</sup></span>, …,{' '}
                <span className="text-violet-400">z<sub>N</sub><sup>txt</sup></span>]
              </div>
              <div className="text-sm text-slate-500">
                Z ∈ ℝ<sup>(M+N)×d</sup> — a single matrix fed into the transformer, where M visual
                tokens precede N text tokens. Self-attention operates over all M+N positions,
                enabling cross-modal reasoning.
              </div>
            </div>
          </MathBlock>

          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-6">
            <h3 className="mb-4 text-sm font-mono text-amber-400">Modality Alignment — Matrix View</h3>
            <MatrixChain
              matrices={[
                { rows: 6, cols: 8, label: 'X (pixels)', dims: 'H×W×3', color: '#22d3ee', annotation: 'flatten + patch' },
                { rows: 4, cols: 6, label: 'V (visual)', dims: 'M×d_v', color: '#06b6d4', annotation: 'ViT encoder' },
                { rows: 4, cols: 6, label: 'Ẑ (projected)', dims: 'M×d', color: '#f472b6', highlight: true, annotation: 'W_proj · V' },
                { rows: 3, cols: 6, label: 'E (text)', dims: 'N×d', color: '#a78bfa', annotation: 'embedding lookup' },
              ]}
              operators={['→', '→', '⊕']}
            />
            <p className="mt-6 text-center text-sm text-slate-500">
              Both Ẑ and E live in the same d-dimensional space → concatenated into Z for the LLM
            </p>
          </div>
        </div>

        <motion.div
          className="mt-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <span className="text-xs text-slate-500">Scroll to explore the architecture</span>
          <motion.div
            className="h-8 w-5 rounded-full border border-slate-600 p-1"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="mx-auto h-2 w-1 rounded-full bg-neon-cyan" />
          </motion.div>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
