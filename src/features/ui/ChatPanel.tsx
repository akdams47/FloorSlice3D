import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '../../store/useChatStore'
import ChatMessage from './ChatMessage'
import ProviderSelect from './ProviderSelect'

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const messages = useChatStore((s) => s.messages)
  const isGenerating = useChatStore((s) => s.isGenerating)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const clearMessages = useChatStore((s) => s.clearMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isGenerating) return
    setInput('')
    sendMessage(trimmed)
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 pointer-events-auto
          w-10 h-10 rounded-xl
          bg-black/60 backdrop-blur-xl border border-white/10
          flex items-center justify-center
          hover:bg-black/80 transition-colors
          text-white/80 hover:text-white text-lg"
        title={isOpen ? 'Close AI chat' : 'Open AI chat'}
      >
        {isOpen ? '\u2715' : '\u2728'}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="absolute top-16 left-4 bottom-12 w-80 pointer-events-auto
            rounded-xl border border-white/10
            bg-black/70 backdrop-blur-xl
            shadow-2xl shadow-black/40
            flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex flex-col gap-1 flex-1 mr-3">
              <h3 className="text-sm font-semibold text-white/90">AI Floor Plan</h3>
              <ProviderSelect />
            </div>
            <button
              onClick={clearMessages}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
              title="Clear chat"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.length === 0 && (
              <div className="text-center text-white/30 text-xs mt-8 px-4">
                Describe a floor plan and AI will generate it in 3D.
                <br /><br />
                Try: "Design a 2-bedroom apartment with an open kitchen and living room"
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-3 py-2 rounded-xl rounded-bl-sm text-sm text-white/50">
                  <span className="animate-pulse">Generating floor plan...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isGenerating ? 'Generating...' : 'Describe your floor plan...'}
                disabled={isGenerating}
                className="flex-1 px-3 py-2 rounded-lg text-sm
                  bg-white/10 border border-white/10 text-white
                  placeholder-white/30
                  focus:outline-none focus:border-indigo-500
                  disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isGenerating || !input.trim()}
                className="px-3 py-2 rounded-lg text-sm font-medium
                  bg-indigo-600 hover:bg-indigo-500 text-white
                  disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed
                  transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
