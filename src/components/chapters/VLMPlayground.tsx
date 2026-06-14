import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { SectionWrapper } from '../layout/SectionWrapper'
import { MathBlock, ProseBlock } from '../ui/MathBlock'

const SAMPLE_IMAGES = [
  { id: 'sunset', label: 'Sunset Beach', emoji: '🌅', colors: ['#f97316', '#ec4899', '#8b5cf6'] },
  { id: 'city', label: 'City Street', emoji: '🏙️', colors: ['#3b82f6', '#6366f1', '#1e293b'] },
  { id: 'forest', label: 'Forest Path', emoji: '🌲', colors: ['#22c55e', '#15803d', '#365314'] },
  { id: 'food', label: 'Gourmet Plate', emoji: '🍽️', colors: ['#fbbf24', '#ef4444', '#f97316'] },
]

const SAMPLE_PROMPTS = [
  'Describe what you see in this image.',
  'What colors dominate this scene?',
  'What mood does this image convey?',
  'List the main objects visible.',
]

const MOCK_RESPONSES: Record<string, Record<string, string>> = {
  sunset: {
    'Describe what you see in this image.':
      'A breathtaking sunset over a calm ocean beach. Golden and pink hues paint the sky, reflecting off gentle waves lapping at the sandy shore.',
    'What colors dominate this scene?':
      'Warm oranges, deep pinks, and purples dominate the sky, contrasted by the dark silhouette of the horizon and golden sand.',
    'What mood does this image convey?':
      'Serene and contemplative — evoking peace, the end of a day, and quiet reflection.',
    'List the main objects visible.':
      'Ocean, sandy beach, sunset sky, horizon line, gentle waves, scattered clouds.',
  },
  city: {
    'Describe what you see in this image.':
      'A bustling urban street scene with tall buildings, pedestrians, vehicles, and neon signage illuminating the evening atmosphere.',
    'What colors dominate this scene?':
      'Cool blues and grays from buildings, punctuated by warm neon accents in pink and orange.',
    'What mood does this image convey?':
      'Energetic and dynamic — the pulse of city life with a hint of urban solitude.',
    'List the main objects visible.':
      'Skyscrapers, cars, pedestrians, streetlights, shop signs, crosswalk, traffic signals.',
  },
  forest: {
    'Describe what you see in this image.':
      'A winding path through a dense forest canopy. Sunlight filters through green leaves, casting dappled shadows on the mossy trail.',
    'What colors dominate this scene?':
      'Rich greens of foliage, earthy browns of the path, and golden sunlight breaking through.',
    'What mood does this image convey?':
      'Tranquil and immersive — a sense of natural wonder and peaceful exploration.',
    'List the main objects visible.':
      'Trees, forest path, moss, ferns, sunlight rays, fallen leaves, distant clearing.',
  },
  food: {
    'Describe what you see in this image.':
      'An artfully plated gourmet dish featuring seared protein, colorful vegetables, and a delicate sauce drizzle on fine china.',
    'What colors dominate this scene?':
      'Warm golds and reds from the main dish, vibrant greens from garnish, white plate as contrast.',
    'What mood does this image convey?':
      'Sophisticated and appetizing — fine dining elegance with culinary artistry.',
    'List the main objects visible.':
      'Seared meat, roasted vegetables, sauce, garnish herbs, white plate, table setting.',
  },
}

type ProcessingStep = 'idle' | 'encoding' | 'projecting' | 'attending' | 'generating' | 'done'

const STEP_MATH: Record<ProcessingStep, string> = {
  idle: '',
  encoding: 'V = ViT(X) ∈ ℝ^{196×1024}',
  projecting: 'Ẑ = W_proj · V ∈ ℝ^{196×4096}',
  attending: 'H^ℓ = MHA(H^{ℓ-1}) — cross-modal attention over M+N tokens',
  generating: 'P(y_i | y_{<i}, Z) = softmax(W_out · h_i)',
  done: 'ŷ = (y₁, y₂, …, y_T) — autoregressive decode complete',
}

const TOKEN_STYLES = {
  visual: { label: 'text-cyan-400', token: 'border-cyan-400/30' },
  text: { label: 'text-violet-400', token: 'border-violet-400/30' },
} as const

function TokenStream({
  tokens,
  label,
  variant,
}: {
  tokens: string[]
  label: string
  variant: keyof typeof TOKEN_STYLES
}) {
  const styles = TOKEN_STYLES[variant]
  return (
    <div className="space-y-2">
      <span className={`font-mono text-[10px] ${styles.label}`}>{label}</span>
      <div className="flex flex-wrap gap-1">
        {tokens.map((t, i) => (
          <motion.span
            key={`${t}-${i}`}
            className={`rounded px-2 py-0.5 font-mono text-[10px] border ${styles.token} bg-slate-800/80`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
          >
            {t}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export function VLMPlayground() {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0])
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0])
  const [step, setStep] = useState<ProcessingStep>('idle')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const runInference = () => {
    if (isRunning) return
    setIsRunning(true)
    setOutput('')
    setStep('encoding')

    const steps: ProcessingStep[] = ['encoding', 'projecting', 'attending', 'generating', 'done']
    let i = 0

    const interval = setInterval(() => {
      i++
      if (i < steps.length) {
        setStep(steps[i])
      } else {
        clearInterval(interval)
        const response =
          MOCK_RESPONSES[selectedImage.id]?.[prompt] ??
          'The model processes visual and text tokens jointly to generate a contextual response.'
        setOutput(response)
        setIsRunning(false)
      }
    }, 900)
  }

  useEffect(() => {
    setOutput('')
    setStep('idle')
  }, [selectedImage, prompt])

  const visualTokens = ['[IMG]', 'ẑ₁', 'ẑ₂', 'ẑ₃', '…', 'ẑ_M']
  const textTokens = prompt.split(' ').map((w) => w.replace(/[^a-zA-Z?]/g, ''))

  const stepOrder: ProcessingStep[] = ['encoding', 'projecting', 'attending', 'generating']
  const currentStepIdx = stepOrder.indexOf(step)

  return (
    <SectionWrapper id="playground" chapterNumber={5} chapterTitle="Playground">
      <motion.h2
        className="mb-6 text-4xl font-bold text-white md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        VLM Playground
      </motion.h2>

      <motion.p
        className="mb-8 max-w-3xl text-lg text-slate-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Walk through the complete inference pipeline — from raw image tensor to autoregressive text
        generation — and see how visual and textual tokens fuse inside the transformer.
      </motion.p>

      <ProseBlock title="End-to-End Inference" delay={0.1}>
        <p>
          At inference time, a VLM performs five stages: (1) encode the image into visual tokens
          via ViT, (2) project them into the LLM embedding space, (3) concatenate with text token
          embeddings to form the joint sequence Z, (4) run L transformer layers with cross-modal
          self-attention, and (5) autoregressively decode output tokens one at a time.
        </p>
      </ProseBlock>

      <MathBlock title="Complete Forward Pass" delay={0.2} className="mb-12">
        <div className="space-y-3 text-sm">
          <div><span className="text-slate-500">1.</span> <span className="text-cyan-400">V</span> = ViT(X) <span className="text-slate-500">— encode image</span></div>
          <div><span className="text-slate-500">2.</span> <span className="text-pink-400">Ẑ</span> = Proj(V) <span className="text-slate-500">— align to LLM space</span></div>
          <div><span className="text-slate-500">3.</span> <span className="text-green-400">Z</span> = [Ẑ ; Embed(T)] <span className="text-slate-500">— fuse modalities</span></div>
          <div><span className="text-slate-500">4.</span> <span className="text-violet-400">H<sup>L</sup></span> = Transformer<sup>L</sup>(Z) <span className="text-slate-500">— deep processing</span></div>
          <div><span className="text-slate-500">5.</span> <span className="text-amber-400">ŷ</span> ~ ∏ P(y<sub>i</sub> | y<sub>&lt;i</sub>, Z) <span className="text-slate-500">— decode</span></div>
        </div>
      </MathBlock>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
            <h3 className="mb-4 font-mono text-sm text-cyan-400">Select Image</h3>
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_IMAGES.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded-xl border p-4 text-left transition-all duration-300 ${
                    selectedImage.id === img.id
                      ? 'border-cyan-400/50 bg-cyan-400/5'
                      : 'border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div
                    className="mb-2 flex h-16 items-center justify-center rounded-lg text-3xl"
                    style={{
                      background: `linear-gradient(135deg, ${img.colors.join(', ')})`,
                    }}
                  >
                    {img.emoji}
                  </div>
                  <span className="text-xs text-slate-300">{img.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
            <h3 className="mb-4 font-mono text-sm text-violet-400">Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="mb-3 w-full resize-none rounded-xl border border-slate-600/50 bg-slate-950/60 px-4 py-3 font-mono text-sm text-slate-200 outline-none transition-colors focus:border-violet-400/50"
              placeholder="Ask something about the image..."
            />
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  className="rounded-lg border border-slate-700/50 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-violet-400/30 hover:text-slate-200"
                >
                  {p.length > 30 ? p.slice(0, 30) + '…' : p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={runInference}
            disabled={isRunning}
            className="w-full rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-400/10 to-violet-400/10 py-4 font-mono text-sm text-cyan-400 transition-all hover:from-cyan-400/20 hover:to-violet-400/20 disabled:opacity-50"
          >
            {isRunning ? 'Processing...' : 'Run Inference →'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
            <h3 className="mb-4 font-mono text-sm text-amber-400">Inference Pipeline</h3>
            <div className="space-y-3">
              {([
                { id: 'encoding' as const, label: 'ViT Encoding', desc: 'X → V ∈ ℝ^{M×d_v}' },
                { id: 'projecting' as const, label: 'Projection Layer', desc: 'V → Ẑ ∈ ℝ^{M×d}' },
                { id: 'attending' as const, label: 'Cross-Modal Attention', desc: 'Z = [Ẑ; E_text] → H^L' },
                { id: 'generating' as const, label: 'Autoregressive Decode', desc: 'P(y_i | y_{<i}, Z)' },
              ]).map((s, idx) => (
                <motion.div
                  key={s.id}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-all duration-300 ${
                    step === s.id
                      ? 'border-cyan-400/50 bg-cyan-400/5'
                      : step === 'done' || currentStepIdx > idx
                        ? 'border-green-400/30 bg-green-400/5 opacity-70'
                        : 'border-slate-700/30 opacity-40'
                  }`}
                  animate={{ scale: step === s.id ? 1.02 : 1 }}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      step === s.id
                        ? 'bg-cyan-400 animate-pulse'
                        : step === 'done' || currentStepIdx > idx
                          ? 'bg-green-400'
                          : 'bg-slate-600'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-slate-200">{s.label}</div>
                    <div className="font-mono text-[10px] text-slate-500">{s.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {step !== 'idle' && STEP_MATH[step] && (
              <motion.div
                className="mt-4 rounded-lg border border-slate-700/50 bg-slate-950/60 px-4 py-3 font-mono text-xs text-cyan-400/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={step}
              >
                {STEP_MATH[step]}
              </motion.div>
            )}
          </div>

          {step !== 'idle' && (
            <motion.div
              className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="mb-3 font-mono text-sm text-pink-400">Joint Token Sequence Z</h3>
              <div className="space-y-3">
                <TokenStream tokens={visualTokens} label="VISUAL TOKENS (M=196)" variant="visual" />
                <div className="text-center font-mono text-xs text-slate-600">
                  Z = Concat(Ẑ, E) ∈ ℝ<sup>(M+N)×d</sup>
                </div>
                <TokenStream tokens={textTokens} label="TEXT TOKENS" variant="text" />
              </div>
            </motion.div>
          )}

          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 min-h-[140px]">
            <h3 className="mb-3 font-mono text-sm text-green-400">Output</h3>
            <AnimatePresence mode="wait">
              {output ? (
                <motion.p
                  key="output"
                  className="text-sm leading-relaxed text-slate-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {output}
                </motion.p>
              ) : (
                <motion.p
                  key="placeholder"
                  className="text-sm text-slate-600 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {isRunning ? 'Generating response...' : 'Run inference to see the model output.'}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Deep dive section */}
      <div className="mt-20 space-y-8">
        <h3 className="font-mono text-sm text-cyan-400">Mathematical Deep Dive</h3>

        <div className="grid gap-6 md:grid-cols-2">
          <MathBlock title="Causal Attention Mask" delay={0.1}>
            <div className="space-y-3 text-sm">
              <div>
                M<sub>ij</sub> = {'{'} 0 if j ≤ i or j ≤ M, −∞ otherwise {'}'}
              </div>
              <div className="text-slate-500">
                Text token i can attend to all visual tokens (j ≤ M) and previous text tokens (j ≤ i).
                Visual tokens only attend to other visual tokens.
              </div>
              <div>
                <span className="text-violet-400">Ã</span> = softmax(QK<sup>T</sup>/√d<sub>k</sub> + M) · V
              </div>
            </div>
          </MathBlock>

          <MathBlock title="Autoregressive Decoding" delay={0.2}>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-amber-400">P</span>(y<sub>i</sub> | y<sub>&lt;i</sub>, X, T) = softmax(W<sub>out</sub> · h<sub>M+N+i</sub>)
              </div>
              <div className="text-slate-500">
                Each output token is sampled from the vocabulary distribution. The token is appended
                to the sequence, and the process repeats until EOS or max length.
              </div>
              <div>
                <span className="text-green-400">ŷ</span> = argmax or sample from P(·) at each step
              </div>
            </div>
          </MathBlock>
        </div>

        <ProseBlock title="Training Objective" delay={0.3}>
          <p>
            During training, the VLM is optimized with standard cross-entropy loss over the output
            token sequence. Given image X, instruction T, and ground-truth response Y = (y₁, …, y_T),
            the loss is the negative log-likelihood of each token conditioned on all prior tokens and
            the multimodal context:
          </p>
        </ProseBlock>

        <MathBlock title="Cross-Entropy Loss" delay={0.4}>
          <div className="space-y-3">
            <div className="text-lg">
              <span className="text-red-400">ℒ</span> = −∑<sub className="text-xs">i=1</sub><sup className="text-xs">T</sup> log P(y<sub>i</sub> | y<sub>&lt;i</sub>, X, T; θ)
            </div>
            <div className="text-sm text-slate-500">
              Only the response tokens contribute to the loss (instruction tokens are masked).
              In practice, θ often includes only the projection layer and LoRA adapters while the
              ViT and LLM backbone remain frozen.
            </div>
          </div>
        </MathBlock>
      </div>

      <motion.footer
        className="mt-24 border-t border-slate-800 pt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="font-mono text-sm text-slate-500">
          Vision-Language Models — where pixels meet prose.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Built with React · Tailwind CSS · Framer Motion
        </p>
      </motion.footer>
    </SectionWrapper>
  )
}
