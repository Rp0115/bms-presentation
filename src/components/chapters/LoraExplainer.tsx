import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { SectionWrapper } from '../layout/SectionWrapper'
import { MathBlock, ProseBlock } from '../ui/MathBlock'
import { MatrixChain, MatrixViz } from '../ui/MatrixViz'

type Mode = 'full' | 'lora' | 'qlora'

function LoRAVisualization() {
  return (
    <div className="space-y-8">
      <MatrixChain
        matrices={[
          { rows: 8, cols: 8, label: 'W₀', dims: 'd×d', color: '#64748b', frozen: true, annotation: 'pre-trained, frozen' },
          { rows: 8, cols: 2, label: 'B', dims: 'd×r', color: '#22d3ee', highlight: true, small: true, annotation: 'trainable' },
          { rows: 2, cols: 8, label: 'A', dims: 'r×d', color: '#a78bfa', highlight: true, small: true, annotation: 'trainable' },
        ]}
        operators={['+', '·']}
      />

      <MathBlock title="LoRA Forward Pass">
        <div className="space-y-4">
          <div className="text-lg">
            <span className="text-green-400">h</span> = W₀x + <span className="text-cyan-400">B</span> · <span className="text-violet-400">A</span> · x
          </div>
          <div className="text-sm text-slate-500">
            W₀ is frozen (no gradient) · Only A and B receive gradient updates
          </div>
          <div>
            <span className="text-amber-400">ΔW</span> = B · A ∈ ℝ<sup>d×d</sup> where rank(ΔW) ≤ r
          </div>
        </div>
      </MathBlock>
    </div>
  )
}

function QLoRAVisualization() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {([
          {
            title: '4-bit NF4 Quantization',
            desc: 'Weights are quantized to 4-bit NormalFloat — a data-driven format optimized for normally-distributed weight values.',
            titleClass: 'text-cyan-400',
            math: 'W̃₀ = NF4(W₀) ∈ {±q₁, …, ±q₁₆}',
          },
          {
            title: 'Double Quantization',
            desc: 'The quantization constants (scale factors) are themselves quantized to 8-bit, saving ~0.37 bits per parameter on average.',
            titleClass: 'text-violet-400',
            math: 'c̃ = quant₈(c) where c = max|W| / 7',
          },
          {
            title: 'LoRA in BF16',
            desc: 'Adapter matrices A, B remain in 16-bit brain float — full precision for the small number of trainable params.',
            titleClass: 'text-pink-400',
            math: 'ΔW = B_bf16 · A_bf16',
          },
        ] as const).map((item, i) => (
          <motion.div
            key={item.title}
            className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
          >
            <h4 className={`mb-2 font-mono text-sm ${item.titleClass}`}>{item.title}</h4>
            <p className="mb-3 text-sm text-slate-400">{item.desc}</p>
            <code className="block rounded-lg bg-slate-950/80 px-3 py-2 font-mono text-xs text-slate-300">
              {item.math}
            </code>
          </motion.div>
        ))}
      </div>

      <MathBlock title="QLoRA Dequantization at Inference">
        <div className="space-y-3">
          <div>
            <span className="text-green-400">h</span> = dequant(<span className="text-slate-400">W̃₀</span>) · x + <span className="text-cyan-400">B</span> · <span className="text-violet-400">A</span> · x
          </div>
          <div className="text-sm text-slate-500">
            dequant(W̃₀) ≈ W₀ (lossy reconstruction) · LoRA correction applied in full precision
          </div>
        </div>
      </MathBlock>

      <motion.div
        className="grid gap-6 rounded-2xl border border-green-400/20 bg-slate-900/30 p-8 md:grid-cols-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {[
          { value: '65B', label: 'total parameters', sub: '|θ| = 65 × 10⁹' },
          { value: '~48 GB', label: 'full fine-tune (FP16)', sub: '2 bytes × 65B params' },
          { value: '~12 GB', label: 'QLoRA (1× A100)', sub: '4-bit base + bf16 LoRA' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-green-400">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
            <div className="mt-1 font-mono text-[10px] text-slate-600">{stat.sub}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function LoraExplainer() {
  const [mode, setMode] = useState<Mode>('full')

  return (
    <SectionWrapper id="lora" chapterNumber={4} chapterTitle="Efficient Evolution">
      <motion.h2
        className="mb-6 text-4xl font-bold text-white md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        LoRA & QLoRA
      </motion.h2>

      <motion.p
        className="mb-8 max-w-3xl text-lg text-slate-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Training a VLM end-to-end requires updating billions of parameters — storing gradients,
        optimizer states, and activations. Parameter-Efficient Fine-Tuning (PEFT) methods like LoRA
        and QLoRA reduce this to a fraction of the cost.
      </motion.p>

      <ProseBlock title="Why Full Fine-Tuning is Expensive">
        <p>
          Consider a 7B-parameter LLM with d=4096. Each transformer layer contains attention
          projections (W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub>, W<sub>O</sub>) and FFN weights
          (W₁, W₂) — each of size up to 4096×4096. With L=32 layers, that is hundreds of weight
          matrices, each requiring gradient storage during backpropagation.
        </p>
        <p>
          Full fine-tuning memory ≈ model weights + gradients + optimizer states (Adam stores 2
          momentum vectors per param) + activations. For a 7B model in FP16: ~14 GB weights + ~14 GB
          gradients + ~28 GB optimizer = <strong className="text-red-400">~56 GB minimum</strong>,
          before activations. A 65B VLM is simply infeasible on consumer hardware.
        </p>
      </ProseBlock>

      <MathBlock title="Memory Cost Formula" delay={0.1} className="mb-10">
        <div className="space-y-3">
          <div>
            <span className="text-red-400">M</span><sub>full</sub> ≈ |θ| × (2 + 2 + 2) bytes = 6 × |θ| bytes
          </div>
          <div className="text-sm text-slate-500">
            (FP16 weights + FP16 gradients + 2× FP32 Adam states)
          </div>
          <div>
            <span className="text-green-400">M</span><sub>LoRA</sub> ≈ |θ| × 0.5 bytes + 2 × (2 × L × d × r) bytes
          </div>
          <div className="text-sm text-slate-500">
            (4-bit frozen base + bf16 LoRA adapters with rank r)
          </div>
        </div>
      </MathBlock>

      {/* Mode tabs */}
      <div className="mb-10 flex flex-wrap gap-2">
        {([
          { id: 'full' as Mode, label: 'Full Fine-Tune', sub: 'Update all W ∈ ℝᵈˣᵈ' },
          { id: 'lora' as Mode, label: 'LoRA', sub: 'Low-rank ΔW = B·A' },
          { id: 'qlora' as Mode, label: 'QLoRA', sub: '4-bit W₀ + LoRA' },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`rounded-xl border px-5 py-3 text-left transition-all duration-300 ${
              mode === tab.id
                ? 'border-cyan-400/50 bg-cyan-400/10'
                : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600'
            }`}
          >
            <div className={`font-mono text-sm ${mode === tab.id ? 'text-cyan-400' : 'text-slate-300'}`}>
              {tab.label}
            </div>
            <div className="text-xs text-slate-500">{tab.sub}</div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'full' && (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 rounded-2xl border border-red-500/20 bg-slate-900/40 p-8"
          >
            <h3 className="font-mono text-sm text-red-400">Full Fine-Tuning — The Baseline</h3>

            <ProseBlock>
              <p>
                In full fine-tuning, every weight matrix W in the model is updated via gradient
                descent: W ← W − η∇<sub>W</sub>ℒ. For a weight matrix of shape d×d, this means d²
                trainable parameters <em>per matrix</em>, and the optimizer must store state for
                each one.
              </p>
            </ProseBlock>

            <div className="flex justify-center">
              <MatrixViz rows={12} cols={12} label="W (all trainable)" dims="d×d" color="#ef4444" highlight />
            </div>

            <MathBlock title="Parameter Count">
              <div className="space-y-2">
                <div>
                  Per layer: 4 × d² (attention) + 2 × d × 4d (FFN) = <span className="text-red-400">12d²</span> params
                </div>
                <div>
                  Full model: L × 12d² ≈ <span className="text-red-400">32 × 12 × 4096² ≈ 6.4B</span> trainable
                </div>
                <div className="text-sm text-slate-500">
                  Plus embedding layer (|V| × d) and output head — total ~7B for LLaMA-2 7B
                </div>
              </div>
            </MathBlock>
          </motion.div>
        )}

        {mode === 'lora' && (
          <motion.div
            key="lora"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 rounded-2xl border border-violet-400/20 bg-slate-900/40 p-8"
          >
            <h3 className="font-mono text-sm text-violet-400">Low-Rank Adaptation (LoRA)</h3>

            <ProseBlock>
              <p>
                LoRA (Hu et al., 2021) is based on a key insight: the weight updates ΔW during
                fine-tuning have <strong className="text-slate-200">low intrinsic rank</strong>.
                Instead of learning a full d×d update, we factorize it into two small matrices
                B ∈ ℝ<sup>d×r</sup> and A ∈ ℝ<sup>r×d</sup> where r ≪ d (typically r = 8, 16, or 64).
              </p>
              <p>
                The pre-trained weight W₀ stays frozen. Only A and B are initialized (A with random
                Gaussian, B with zeros so ΔW starts at zero) and trained. This means we train r×d + d×r
                = 2rd parameters per layer instead of d².
              </p>
            </ProseBlock>

            <LoRAVisualization />

            <MathBlock title="Parameter Savings">
              <div className="space-y-3">
                <div>
                  Full: d² = 4096² = <span className="text-red-400">16,777,216</span> params/matrix
                </div>
                <div>
                  LoRA (r=16): 2 × 4096 × 16 = <span className="text-green-400">131,072</span> params/matrix
                </div>
                <div>
                  Reduction: <span className="text-green-400">128×</span> fewer trainable parameters
                </div>
                <div className="text-sm text-slate-500 border-t border-slate-800 pt-3">
                  Applied to q, k, v, o projections across L=32 layers:
                  4 × 32 × 131,072 ≈ <span className="text-cyan-400">16.8M</span> trainable
                  vs <span className="text-red-400">2.1B</span> for full fine-tune
                </div>
              </div>
            </MathBlock>
          </motion.div>
        )}

        {mode === 'qlora' && (
          <motion.div
            key="qlora"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 rounded-2xl border border-green-400/20 bg-slate-900/40 p-8"
          >
            <h3 className="font-mono text-sm text-green-400">QLoRA — Quantized LoRA</h3>

            <ProseBlock>
              <p>
                QLoRA (Dettmers et al., 2023) pushes efficiency further by storing the frozen base
                model in <strong className="text-slate-200">4-bit NormalFloat (NF4)</strong> format.
                NF4 is a quantization data type where the 16 representable values are chosen to
                match the expected normal distribution of neural network weights — minimizing
                quantization error.
              </p>
              <p>
                The key trick: weights are dequantized on-the-fly during the forward pass (in FP16/BF16),
                the LoRA correction is added in full precision, and only the small A, B matrices
                accumulate gradients. This lets you fine-tune a 65B model on a single 48GB GPU.
              </p>
            </ProseBlock>

            <QLoRAVisualization />

            <MathBlock title="NF4 Quantization">
              <div className="space-y-3">
                <div>
                  <span className="text-cyan-400">NF4</span> = {'{'}±q₁, ±q₂, …, ±q₈{'}'} where qᵢ are optimized for N(0, σ²)
                </div>
                <div>
                  <span className="text-violet-400">W̃</span><sub>ij</sub> = round_nf4(W<sub>ij</sub> / s) · s
                </div>
                <div className="text-sm text-slate-500">
                  s = block-wise scale factor · 4 bits per weight → 8× compression vs FP32
                </div>
              </div>
            </MathBlock>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
