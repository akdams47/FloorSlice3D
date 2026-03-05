import { Router, Request, Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { buildMessages } from '../prompts/system-prompt'

const router = Router()

interface GenerateRequest {
  provider: 'claude' | 'openai'
  messages: { role: 'user' | 'assistant'; content: string }[]
  currentPlan: object | null
}

router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  const { provider, messages, currentPlan } = req.body as GenerateRequest

  if (!messages || messages.length === 0) {
    res.status(400).json({ error: 'Messages are required' })
    return
  }

  const { systemPrompt, messages: chatMessages } = buildMessages(messages, currentPlan)

  try {
    if (provider === 'claude') {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
        return
      }

      const anthropic = new Anthropic({ apiKey })
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: chatMessages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      })

      const textBlock = response.content.find((b) => b.type === 'text')
      if (!textBlock || textBlock.type !== 'text') {
        res.status(500).json({ error: 'No text response from Claude' })
        return
      }

      res.json({ content: textBlock.text, provider: 'claude' })
    } else if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
        return
      }

      const openai = new OpenAI({ apiKey })
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatMessages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        ],
        max_tokens: 4096,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        res.status(500).json({ error: 'No response from OpenAI' })
        return
      }

      res.json({ content, provider: 'openai' })
    } else {
      res.status(400).json({ error: `Unknown provider: ${provider}` })
    }
  } catch (error: any) {
    console.error(`[${provider}] API error:`, error.message || error)
    res.status(500).json({
      error: `AI generation failed: ${error.message || 'Unknown error'}`,
    })
  }
})

export default router
