import type { ChatMessage as ChatMessageType } from '../../store/useChatStore'

interface ChatMessageProps {
  message: ChatMessageType
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed
          ${isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : message.isError
              ? 'bg-red-900/50 text-red-200 rounded-bl-sm border border-red-500/30'
              : 'bg-white/10 text-white/90 rounded-bl-sm'
          }`}
      >
        {message.content}
      </div>
    </div>
  )
}
