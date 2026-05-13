export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  meta?: Record<string, any>
}
