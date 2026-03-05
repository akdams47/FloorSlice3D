import { create } from 'zustand'
import { useAppStore } from './useAppStore'
import { parseFloorPlan } from '../utils/parseFloorPlan'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isError?: boolean
}

type Provider = 'claude' | 'openai'

interface ChatState {
  messages: ChatMessage[]
  provider: Provider
  isGenerating: boolean

  setProvider: (provider: Provider) => void
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

let messageCounter = 0

function createMessage(role: 'user' | 'assistant', content: string, isError = false): ChatMessage {
  return {
    id: `msg-${++messageCounter}`,
    role,
    content,
    timestamp: Date.now(),
    isError,
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  provider: 'claude',
  isGenerating: false,

  setProvider: (provider) => set({ provider }),

  clearMessages: () => set({ messages: [] }),

  sendMessage: async (content: string) => {
    const { provider, messages } = get()

    // Add user message
    const userMsg = createMessage('user', content)
    set({ messages: [...messages, userMsg], isGenerating: true })

    try {
      // Build conversation history for the API
      const conversationMessages = [...messages, userMsg]
        .filter((m) => !m.isError)
        .map((m) => ({ role: m.role, content: m.content }))

      // Get current floor plan for context
      const currentPlan = useAppStore.getState().floorPlan

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          messages: conversationMessages,
          currentPlan,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Server error' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      const aiContent = data.content

      // Try to parse floor plan from response
      const { plan, error } = parseFloorPlan(aiContent)

      if (plan) {
        // Update the 3D scene with the new floor plan
        useAppStore.getState().setFloorPlan(plan)

        const assistantMsg = createMessage(
          'assistant',
          `Floor plan generated successfully with ${plan.rooms.length} rooms and ${plan.walls.length} walls.`,
        )
        set((s) => ({ messages: [...s.messages, assistantMsg], isGenerating: false }))
      } else {
        // JSON parsing failed — show the error
        const assistantMsg = createMessage('assistant', error || 'Failed to parse floor plan', true)
        set((s) => ({ messages: [...s.messages, assistantMsg], isGenerating: false }))
      }
    } catch (error: any) {
      const errorMsg = createMessage(
        'assistant',
        `Error: ${error.message || 'Failed to connect to server'}`,
        true,
      )
      set((s) => ({ messages: [...s.messages, errorMsg], isGenerating: false }))
    }
  },
}))
