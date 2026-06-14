import { motion } from 'framer-motion'

interface MatrixVizProps {
  rows: number
  cols: number
  label: string
  dims?: string
  color?: string
  frozen?: boolean
  highlight?: boolean
  small?: boolean
  annotation?: string
}

export function MatrixViz({
  rows,
  cols,
  label,
  dims,
  color = '#64748b',
  frozen = false,
  highlight = false,
  small = false,
  annotation,
}: MatrixVizProps) {
  const cellSize = small ? 7 : 11
  const gap = small ? 1.5 : 2.5

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={`grid rounded-lg border p-2.5 transition-all duration-500 ${
          highlight ? 'border-cyan-400/50' : 'border-slate-600/50'
        } ${frozen ? 'opacity-60' : ''}`}
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm"
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: color,
              opacity: frozen ? 0.35 : 0.45 + (i % 4) * 0.12,
            }}
          />
        ))}
      </div>
      <span className="font-mono text-xs font-medium text-slate-300">{label}</span>
      {dims && <span className="font-mono text-[10px] text-cyan-400/80">{dims}</span>}
      {frozen && <span className="font-mono text-[10px] text-slate-500">frozen · no grad</span>}
      {annotation && (
        <span className="max-w-[120px] text-center text-[10px] text-slate-500">{annotation}</span>
      )}
    </motion.div>
  )
}

interface MatrixChainProps {
  matrices: MatrixVizProps[]
  operators?: string[]
}

export function MatrixChain({ matrices, operators }: MatrixChainProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
      {matrices.map((m, i) => (
        <div key={m.label} className="flex items-center gap-3 md:gap-4">
          <MatrixViz {...m} />
          {operators && i < operators.length && (
            <span className="font-mono text-lg text-amber-400">{operators[i]}</span>
          )}
        </div>
      ))}
    </div>
  )
}
