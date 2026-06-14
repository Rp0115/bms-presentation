import { motion } from 'framer-motion'
import { useState } from 'react'
import { SectionWrapper } from '../layout/SectionWrapper'
import { MathBlock, ProseBlock } from '../ui/MathBlock'
import { MatrixChain } from '../ui/MatrixViz'

const PATCH_SIZE = 32
const GRID = 4
const NUM_PATCHES = GRID * GRID

function ImagePatchGrid({ activePatch }: { activePatch: number | null }) {
  return (
    <div className="grid grid-cols-4 gap-1">
      {Array.from({ length: NUM_PATCHES }).map((_, i) => {
        const hue = (i * 37) % 360
        return (
          <motion.div
            key={i}
            className={`h-8 w-8 rounded-sm transition-all duration-300 ${
              activePatch === i ? 'ring-2 ring-cyan-400 scale-110' : ''
            }`}
            style={{
              background: `hsl(${hue}, 60%, ${activePatch === i ? '55%' : '35%'})`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          />
        )
      })}
    </div>
  )
}

const STAGE_STYLES = [
  { label: 'Image', icon: '🖼', active: 'border-cyan-400/50 bg-slate-800/80 glow-cyan' },
  { label: 'Patches', icon: '▦', active: 'border-amber-400/50 bg-slate-800/80' },
  { label: 'ViT Encoder', icon: '⚡', active: 'border-violet-400/50 bg-slate-800/80 glow-purple' },
  { label: 'Projection', icon: '🔗', active: 'border-pink-400/50 bg-slate-800/80 glow-purple' },
  { label: 'LLM Space', icon: '💬', active: 'border-green-400/50 bg-slate-800/80' },
] as const

function PipelineFlow({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2 overflow-x-auto py-4 md:gap-4">
      {STAGE_STYLES.map((stage, i) => (
        <div key={stage.label} className="flex items-center gap-2 md:gap-4">
          <motion.div
            className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-3 transition-all duration-500 ${
              i <= step ? stage.active : 'border-slate-700/30 bg-slate-900/30 opacity-40'
            }`}
            animate={{ scale: i === step ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-lg">{stage.icon}</span>
            <span className="whitespace-nowrap font-mono text-xs text-slate-300">
              {stage.label}
            </span>
          </motion.div>
          {i < STAGE_STYLES.length - 1 && (
            <motion.div
              className="h-px w-6 md:w-10"
              animate={{
                background:
                  i < step
                    ? 'linear-gradient(90deg, #22d3ee, #a78bfa)'
                    : 'rgba(51, 65, 85, 0.5)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function ViTConnector() {
  const [activePatch, setActivePatch] = useState<number | null>(null)
  const [pipelineStep, setPipelineStep] = useState(0)

  const advancePipeline = () => {
    setPipelineStep((s) => (s < 4 ? s + 1 : 0))
    if (pipelineStep === 0) setActivePatch(5)
    else if (pipelineStep === 1) setActivePatch(10)
    else setActivePatch(null)
  }

  return (
    <SectionWrapper id="vit" chapterNumber={3} chapterTitle="Connecting the Worlds">
      <motion.h2
        className="mb-6 text-4xl font-bold text-white md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        ViT → LLM
      </motion.h2>

      <motion.p
        className="mb-12 max-w-3xl text-lg text-slate-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        The Vision Transformer converts images into sequences of patch embeddings. A projection layer
        then aligns these visual representations with the LLM&apos;s text embedding space — the
        critical interface that makes multimodal understanding possible.
      </motion.p>

      {/* ViT Mathematics */}
      <div className="mb-16 space-y-8">
        <h3 className="font-mono text-sm text-cyan-400">Vision Transformer — Patch Embedding</h3>

        <ProseBlock>
          <p>
            The ViT (Dosovitskiy et al., 2020) treats an image as a sequence of fixed-size patches,
            analogous to how an LLM treats text as a sequence of tokens. A 224×224 image with patch
            size P=16 produces M = (224/16)² = 196 patches. Each patch is flattened into a vector
            of dimension P²·C = 16²·3 = 768, then linearly projected into the model dimension d<sub>v</sub>.
          </p>
        </ProseBlock>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-4 font-mono text-sm text-cyan-400">Patch Decomposition</h4>
            <div className="mb-6 flex justify-center">
              <div className="rounded-lg border border-slate-600 p-3">
                <ImagePatchGrid activePatch={activePatch} />
                <p className="mt-2 text-center font-mono text-[10px] text-slate-500">
                  {GRID}×{GRID} = {NUM_PATCHES} patches · {PATCH_SIZE}px each
                </p>
              </div>
            </div>

            <MathBlock>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-cyan-400">x<sub>p</sub></span> = Flatten(P<sub>p</sub>) ∈ ℝ<sup>P²·C</sup>
                </div>
                <div>
                  <span className="text-violet-400">z<sub>p</sub><sup>0</sup></span> = W<sub>patch</sub> · x<sub>p</sub> + b
                </div>
                <div className="text-slate-500">
                  W<sub>patch</sub> ∈ ℝ<sup>d<sub>v</sub>×P²C</sup>
                </div>
              </div>
            </MathBlock>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-4 font-mono text-sm text-violet-400">ViT Encoder Stack</h4>

            <div className="space-y-2 mb-6">
              {[
                { layer: 'L0', name: '[CLS] + Patch Embeddings + Positional Encoding' },
                { layer: 'L1–L12', name: 'Transformer Encoder Blocks (self-attention + MLP)' },
                { layer: 'Lout', name: 'Layer Norm → visual token sequence V' },
              ].map((item, i) => (
                <motion.div
                  key={item.layer}
                  className="rounded-lg border border-violet-400/20 bg-slate-800/50 px-4 py-2.5 text-sm text-slate-300"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                >
                  <span className="font-mono text-xs text-violet-400 mr-2">{item.layer}</span>
                  {item.name}
                </motion.div>
              ))}
            </div>

            <MathBlock>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-violet-400">V</span> = ViT(X) ∈ ℝ<sup>M×d<sub>v</sub></sup>
                </div>
                <div className="text-slate-500">
                  M = (H/P)(W/P) patches · d<sub>v</sub> = 1024 (CLIP) or 768 (base ViT)
                </div>
              </div>
            </MathBlock>

            <div className="mt-4">
              <MatrixChain
                matrices={[
                  { rows: 4, cols: 6, label: 'X', dims: 'H×W×C', color: '#22d3ee' },
                  { rows: 4, cols: 4, label: 'V', dims: 'M×d_v', color: '#a78bfa', highlight: true },
                ]}
                operators={['→']}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Projection Layer */}
      <div className="mb-16 space-y-8">
        <h3 className="font-mono text-sm text-pink-400">The Magic Link — Projection Layer</h3>

        <ProseBlock>
          <p>
            The ViT outputs vectors in dimension d<sub>v</sub>, but the LLM expects dimension d
            (e.g., 4096). The <strong className="text-pink-400">projection layer</strong> (also
            called the <em>connector</em> or <em>adapter</em>) is a learned linear or non-linear
            map that bridges this gap. This is the single most important component in VLM design —
            if the projection is poor, the LLM receives visual information it cannot interpret.
          </p>
          <p>
            Different VLM architectures use different connectors: LLaVA uses a simple 2-layer MLP,
            BLIP-2 uses a Q-Former with cross-attention, and Flamingo uses Perceiver Resampler
            modules. All serve the same mathematical purpose: V → Ẑ where Ẑ ∈ ℝ<sup>M×d</sup>.
          </p>
        </ProseBlock>

        <div className="grid gap-6 md:grid-cols-3">
          <MathBlock title="Linear Projection" delay={0.1}>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-pink-400">ẑ<sub>i</sub></span> = W<sub>proj</sub> · v<sub>i</sub>
              </div>
              <div className="text-slate-500">
                W<sub>proj</sub> ∈ ℝ<sup>d×d<sub>v</sub></sup>
              </div>
              <div className="text-slate-500">
                Params: d · d<sub>v</sub> ≈ 4M for d=4096, d<sub>v</sub>=1024
              </div>
            </div>
          </MathBlock>

          <MathBlock title="MLP Connector (LLaVA)" delay={0.2}>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-pink-400">ẑ</span> = W₂ · GELU(W₁ · v + b₁) + b₂
              </div>
              <div className="text-slate-500">
                W₁ ∈ ℝ<sup>d×d<sub>v</sub></sup> , W₂ ∈ ℝ<sup>d×d</sup>
              </div>
              <div className="text-slate-500">
                Adds non-linearity for richer alignment
              </div>
            </div>
          </MathBlock>

          <MathBlock title="Q-Former (BLIP-2)" delay={0.3}>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-pink-400">Q</span> = learned queries ∈ ℝ<sup>32×d</sup>
              </div>
              <div>
                <span className="text-violet-400">Ẑ</span> = CrossAttn(Q, V, V)
              </div>
              <div className="text-slate-500">
                Compresses M patches → 32 query tokens
              </div>
            </div>
          </MathBlock>
        </div>

        <div className="rounded-2xl border border-pink-400/20 bg-slate-900/40 p-8 glow-purple">
          <MatrixChain
            matrices={[
              { rows: 5, cols: 4, label: 'V (visual)', dims: 'M×d_v', color: '#22d3ee', annotation: 'ViT output' },
              { rows: 4, cols: 4, label: 'W_proj', dims: 'd_v×d', color: '#f472b6', highlight: true, annotation: 'trainable' },
              { rows: 5, cols: 4, label: 'Ẑ (aligned)', dims: 'M×d', color: '#4ade80', highlight: true, annotation: 'LLM-ready' },
            ]}
            operators={['×', '=']}
          />

          <MathBlock title="Joint Input to LLM" delay={0.1} className="mt-8">
            <div className="space-y-3">
              <div>
                <span className="text-green-400">Z</span> = Concat(
                <span className="text-cyan-400">Ẑ</span>,{' '}
                <span className="text-violet-400">E<sub>text</sub></span>) ∈ ℝ<sup>(M+N)×d</sup>
              </div>
              <div className="text-sm text-slate-500">
                Visual tokens are prepended to text tokens. The LLM&apos;s causal attention mask
                allows text tokens to attend to all visual tokens, but visual tokens only attend
                among themselves (and not to text).
              </div>
              <div className="text-sm">
                <span className="text-amber-400">H<sup>0</sup></span> = Z + PE{' '}
                <span className="text-slate-500">→ fed into L transformer blocks</span>
              </div>
            </div>
          </MathBlock>
        </div>
      </div>

      {/* Interactive Pipeline */}
      <motion.div
        className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-sm text-amber-400">Interactive Pipeline</h3>
          <button
            onClick={advancePipeline}
            className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 font-mono text-xs text-cyan-400 transition-colors hover:bg-cyan-400/20"
          >
            Step Through →
          </button>
        </div>
        <PipelineFlow step={pipelineStep} />

        <div className="mt-6 grid gap-4 text-sm text-slate-500 md:grid-cols-5">
          {[
            'X ∈ ℝ^{224×224×3}',
            'x_p ∈ ℝ^{768}, M=196',
            'V ∈ ℝ^{196×1024}',
            'Ẑ = W·V ∈ ℝ^{196×4096}',
            'Z ∈ ℝ^{(196+N)×4096}',
          ].map((eq, i) => (
            <div
              key={eq}
              className={`rounded-lg border px-3 py-2 font-mono text-[10px] text-center transition-all ${
                i <= pipelineStep ? 'border-cyan-400/30 text-cyan-400/80' : 'border-slate-700/30'
              }`}
            >
              {eq}
            </div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  )
}
