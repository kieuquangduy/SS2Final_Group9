import type { ChatMessage } from '~/types/chatbot'

export const useChatbot = () => {
  const isLoading = ref<boolean>(false)
  const chatOpen = useState<boolean>('chatbot-open', () => false)

  const toggleChat = useThrottleFn(() => {
    chatOpen.value = !chatOpen.value
  }, 700)

  const messages = useState<ChatMessage[]>('chatbot-messages', () => [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Hi there! I can help you find scholarships or explain how to use the dashboard. What do you need?',
    },
  ])

  const addMessage = (msg: Omit<ChatMessage, 'id'>) => {
    messages.value.push({
      ...msg,
      id: crypto.randomUUID(),
    })
  }

  return { isLoading, chatOpen, toggleChat, messages, addMessage }
}
