export const CHAPTERS = [
  { id: 'vision', label: 'The Vision', number: 1 },
  { id: 'llm', label: 'LLM Core', number: 2 },
  { id: 'vit', label: 'ViT Connector', number: 3 },
  { id: 'lora', label: 'LoRA & QLoRA', number: 4 },
  { id: 'playground', label: 'Playground', number: 5 },
] as const

export type ChapterId = (typeof CHAPTERS)[number]['id']
