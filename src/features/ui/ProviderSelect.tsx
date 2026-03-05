import { useChatStore } from '../../store/useChatStore'

export default function ProviderSelect() {
  const provider = useChatStore((s) => s.provider)
  const setProvider = useChatStore((s) => s.setProvider)

  return (
    <select
      value={provider}
      onChange={(e) => setProvider(e.target.value as 'claude' | 'openai')}
      className="w-full px-2 py-1.5 rounded-lg text-xs
        bg-white/10 border border-white/10 text-white/80
        focus:outline-none focus:border-indigo-500
        cursor-pointer"
    >
      <option value="claude" className="bg-gray-900">Claude (Anthropic)</option>
      <option value="openai" className="bg-gray-900">GPT-4o (OpenAI)</option>
    </select>
  )
}
