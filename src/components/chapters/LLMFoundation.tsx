import { motion } from 'framer-motion'
import { SectionWrapper } from '../layout/SectionWrapper'
import { MathBlock, ProseBlock } from '../ui/MathBlock'
import { MatrixChain, MatrixViz } from '../ui/MatrixViz'

const TOKENS = ['The', 'quick', 'brown', 'fox', 'jumps']
const TOKEN_IDS = [464, 4062, 14178, 39935, 35308]

function TokenEmbedding({ token, index, id }: { token: string; index: number; id: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div className="rounded-lg border border-cyan-400/30 bg-slate-800/80 px-4 py-2 font-mono text-sm text-cyan-400">
        {token}
      </div>
      <span className="font-mono text-[10px] text-slate-600">id={id}</span>
      <motion.div
        className="flex flex-col gap-0.5"
        initial={{ height: 0 }}
        whileInView={{ height: 'auto' }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400/60 to-violet-400/60"
            style={{ width: `${36 + Math.sin(i + index) * 18}px` }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 + i * 0.05 }}
          />
        ))}
      </motion.div>
      <span className="font-mono text-[10px] text-slate-500">eᵢ ∈ ℝ<sup>4096</sup></span>
    </motion.div>
  )
}

function TransformerBlock({ index }: { index: number }) {
  return (
    <motion.div
      className="relative rounded-xl border border-violet-400/30 bg-slate-800/60 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 1.2 + index * 0.2 }}
    >
      <div className="mb-3 font-mono text-xs text-violet-400">
        Block ℓ = {index + 1}
      </div>
      <div className="space-y-2">
        <div className="rounded-lg border border-slate-600/50 bg-slate-900/50 px-3 py-2 text-xs text-slate-400">
          <span className="text-amber-400">MHA</span>: MultiHead(Q, K, V)
        </div>
        <div className="rounded-lg border border-slate-600/50 bg-slate-900/50 px-3 py-2 text-xs text-slate-400">
          <span className="text-green-400">FFN</span>: W₂ · GELU(W₁ · x)
        </div>
        <div className="rounded-lg border border-slate-600/50 bg-slate-900/50 px-3 py-2 text-xs text-slate-400">
          x + Sublayer(LN(x))
        </div>
      </div>
      {index < 2 && (
        <motion.div
          className="absolute -bottom-6 left-1/2 h-6 w-px -translate-x-1/2 bg-gradient-to-b from-violet-400/50 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 + index * 0.2 }}
        />
      )}
    </motion.div>
  )
}

export function LLMFoundation() {
  return (
    <SectionWrapper id="llm" chapterNumber={2} chapterTitle="The Foundation">
      <motion.h2
        className="mb-6 text-4xl font-bold text-white md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        The LLM Core
      </motion.h2>

      <motion.p
        className="mb-12 max-w-3xl text-lg text-slate-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Every VLM inherits a pre-trained Large Language Model as its reasoning engine. Understanding
        how an LLM transforms discrete tokens into contextual representations is prerequisite to
        understanding how visual tokens slot into the same machinery.
      </motion.p>

      {/* Step 1: Tokenization */}
      <div className="mb-20 space-y-8">
        <h3 className="font-mono text-sm text-cyan-400">01 — Tokenization</h3>

        <ProseBlock>
          <p>
            Raw text is first segmented into <strong className="text-slate-200">subword tokens</strong>{' '}
            using algorithms like Byte-Pair Encoding (BPE) or SentencePiece. Unlike word-level
            tokenization, subword methods handle rare words by decomposing them into frequent
            fragments — &quot;unhappiness&quot; might become [&quot;un&quot;, &quot;happiness&quot;].
            The vocabulary size |V| is typically 32,000–128,000 tokens.
          </p>
        </ProseBlock>

        <div className="flex flex-wrap gap-2">
          {TOKENS.map((token, i) => (
            <motion.span
              key={token}
              className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 font-mono text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(34, 211, 238, 0.5)' }}
            >
              t<sub>{i + 1}</sub>=&quot;{token}&quot; → id {TOKEN_IDS[i]}
            </motion.span>
          ))}
        </div>

        <MathBlock title="Tokenization Mapping" delay={0.1}>
          <div className="space-y-2">
            <div>
              <span className="text-violet-400">Tokenizer</span>: string → (t₁, t₂, …, tₙ) where tᵢ ∈ V
            </div>
            <div>
              <span className="text-cyan-400">Lookup</span>: id(tᵢ) ∈ {'{'}0, 1, …, |V|−1{'}'}
            </div>
            <div className="text-sm text-slate-500">
              For GPT-style models: |V| = 50,257 · For LLaMA: |V| = 32,000
            </div>
          </div>
        </MathBlock>
      </div>

      {/* Step 2: Embedding */}
      <div className="mb-20 space-y-8">
        <h3 className="font-mono text-sm text-cyan-400">02 — Embedding Lookup</h3>

        <ProseBlock>
          <p>
            Each token ID is mapped to a dense vector via an{' '}
            <strong className="text-slate-200">embedding matrix E ∈ ℝ<sup>|V|×d</sup></strong>.
            This is a simple row lookup — no computation beyond indexing. The embedding dimension{' '}
            <em>d</em> (4096 for LLaMA-2 7B, 8192 for larger models) determines the width of every
            subsequent matrix operation in the transformer.
          </p>
          <p>
            Embeddings are <em>learned</em> during pre-training: semantically similar tokens end up
            with nearby vectors in ℝ<sup>d</sup>. The geometry of this space — where &quot;king&quot; −
            &quot;man&quot; + &quot;woman&quot; ≈ &quot;queen&quot; — is what gives LLMs their
            linguistic intuition.
          </p>
        </ProseBlock>

        <div className="flex flex-wrap justify-center gap-6 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-8">
          {TOKENS.map((token, i) => (
            <TokenEmbedding key={token} token={token} index={i} id={TOKEN_IDS[i]} />
          ))}
        </div>

        <MathBlock title="Embedding + Positional Encoding" delay={0.2}>
          <div className="space-y-4">
            <div>
              <span className="text-cyan-400">eᵢ</span> = E[id(tᵢ)]{' '}
              <span className="text-slate-500">∈ ℝ<sup>d</sup></span>
            </div>
            <div>
              <span className="text-violet-400">xᵢ</span> = eᵢ + PE(i){' '}
              <span className="text-slate-500">(input to transformer)</span>
            </div>
            <div className="text-sm text-slate-500 border-t border-slate-800 pt-3">
              RoPE (Rotary Position Embedding) — used in LLaMA, applied to Q and K:
              <div className="mt-2">
                <span className="text-amber-400">R<sub>Θ,i</sub></span> · qᵢ ,{' '}
                <span className="text-amber-400">R<sub>Θ,i</sub></span> · kᵢ
              </div>
            </div>
          </div>
        </MathBlock>

        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-6">
          <MatrixChain
            matrices={[
              { rows: 1, cols: 8, label: 'id vector', dims: '1×N', color: '#64748b' },
              { rows: 5, cols: 8, label: 'E (embed)', dims: '|V|×d', color: '#a78bfa', frozen: true },
              { rows: 5, cols: 8, label: 'H⁰', dims: 'N×d', color: '#22d3ee', highlight: true },
            ]}
            operators={['×', '=']}
          />
        </div>
      </div>

      {/* Step 3: Transformer */}
      <div className="space-y-10">
        <h3 className="font-mono text-sm text-cyan-400">03 — Transformer Blocks</h3>

        <ProseBlock>
          <p>
            The core of the LLM is a stack of <em>L</em> identical transformer blocks (L = 32 for
            LLaMA-2 7B, L = 80 for LLaMA-2 70B). Each block applies two sub-layers: multi-head
            self-attention (which lets every token gather context from all other tokens) and a
            position-wise feed-forward network (which transforms each token independently). Residual
            connections and layer normalization stabilize training across deep stacks.
          </p>
        </ProseBlock>

        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
          {[0, 1, 2].map((i) => (
            <TransformerBlock key={i} index={i} />
          ))}
          <span className="font-mono text-slate-600">… × L layers</span>
        </div>

        <MathBlock title="Scaled Dot-Product Attention" delay={0.1}>
          <div className="space-y-4">
            <div>
              <span className="text-violet-400">Q</span> = H · W<sub>Q</sub> ,{' '}
              <span className="text-amber-400">K</span> = H · W<sub>K</sub> ,{' '}
              <span className="text-green-400">V</span> = H · W<sub>V</sub>
            </div>
            <div className="text-sm text-slate-500">
              W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub> ∈ ℝ<sup>d×d<sub>k</sub></sup> — learned projection matrices
            </div>
            <div className="text-lg">
              <span className="text-violet-400">Attention</span>(Q, K, V) ={' '}
              <span className="text-cyan-400">softmax</span>(
              <span className="text-amber-400">QK<sup>T</sup></span> / √d<sub>k</sub>) ·{' '}
              <span className="text-green-400">V</span>
            </div>
            <div className="text-sm text-slate-500">
              The attention weights form an N×N matrix where entry (i,j) measures how much token i
              attends to token j. Softmax ensures rows sum to 1.
            </div>
          </div>
        </MathBlock>

        <MathBlock title="Multi-Head Attention" delay={0.2}>
          <div className="space-y-3">
            <div>
              <span className="text-violet-400">MultiHead</span>(H) = Concat(head₁, …, head<sub>h</sub>) · W<sub>O</sub>
            </div>
            <div>
              head<sub>i</sub> = Attention(H·W<sub>Q</sub><sup>i</sup>, H·W<sub>K</sub><sup>i</sup>, H·W<sub>V</sub><sup>i</sup>)
            </div>
            <div className="text-sm text-slate-500">
              h = 32 heads · d<sub>k</sub> = d/h = 128 · Each head learns different attention patterns
              (syntax, coreference, positional, etc.)
            </div>
          </div>
        </MathBlock>

        <MathBlock title="Feed-Forward Network (per token)" delay={0.3}>
          <div className="space-y-3">
            <div>
              <span className="text-green-400">FFN</span>(x) = W₂ · GELU(W₁ · x + b₁) + b₂
            </div>
            <div className="text-sm text-slate-500">
              W₁ ∈ ℝ<sup>d×d<sub>ff</sub></sup> , W₂ ∈ ℝ<sup>d<sub>ff</sub>×d</sup> where d<sub>ff</sub> = 4d (e.g., 11008 for d=4096)
            </div>
            <div>
              <span className="text-slate-500">Full block:</span>{' '}
              H<sup>ℓ+1</sup> = H<sup>ℓ</sup> + FFN(LN(H<sup>ℓ</sup> + MHA(LN(H<sup>ℓ</sup>))))
            </div>
          </div>
        </MathBlock>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-6">
            <h4 className="mb-4 font-mono text-xs text-amber-400">Attention Matrix (N×N)</h4>
            <MatrixViz rows={8} cols={8} label="softmax(QKᵀ/√dk)" dims="N×N" color="#a78bfa" highlight />
            <p className="mt-3 text-xs text-slate-500">
              Row i shows which tokens position i attends to. Causal masking zeros out future positions.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-6">
            <h4 className="mb-4 font-mono text-xs text-green-400">FFN Weight Matrices</h4>
            <MatrixChain
              matrices={[
                { rows: 4, cols: 3, label: 'x', dims: '1×d', color: '#22d3ee' },
                { rows: 8, cols: 3, label: 'W₁', dims: 'd×4d', color: '#4ade80' },
                { rows: 4, cols: 3, label: 'W₂', dims: '4d×d', color: '#4ade80' },
              ]}
              operators={['×', '×']}
            />
          </div>
        </div>

        <MathBlock title="Output — Next-Token Prediction" delay={0.4}>
          <div className="space-y-3">
            <div>
              <span className="text-cyan-400">logits</span> = H<sup>L</sup> · E<sup>T</sup>{' '}
              <span className="text-slate-500">∈ ℝ<sup>N×|V|</sup></span>
            </div>
            <div>
              <span className="text-amber-400">P</span>(t<sub>next</sub> | t₁…tₙ) ={' '}
              <span className="text-cyan-400">softmax</span>(logits<sub>n</sub>)
            </div>
            <div className="text-sm text-slate-500">
              The final hidden state at position n is projected back to vocabulary space via the
              transposed embedding matrix (weight tying). The model predicts a probability
              distribution over all |V| possible next tokens.
            </div>
          </div>
        </MathBlock>
      </div>
    </SectionWrapper>
  )
}
