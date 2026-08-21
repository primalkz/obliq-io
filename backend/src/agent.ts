import { AppError } from './errors'
import { tools, runTool } from './agent-tools'

const URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'qwen/qwen3.6-27b'

const system = `you are the obliq agent inside a compliance ops dashboard for an indian CA firm.
today is ${new Date().toISOString().slice(0, 10)}.
you answer questions about the firm clients, filings and deadlines. use the tools to fetch real
data before answering, never invent numbers. keep answers short and direct, plain language, no
greetings. if asked to summarise the week, lead with what is overdue, then what is due next.`

export async function askAgent(userId: string, question: string): Promise<string> {
  const messages: any[] = [
    { role: 'system', content: system },
    { role: 'user', content: question },
  ]

  for (let i = 0; i < 4; i++) {
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 2000,
        reasoning_format: 'hidden',
        messages,
        tools,
      }),
    })
    if (!res.ok) {
      if (res.status === 429) throw new AppError(429, 'ai is rate limited, try again in a minute')
      const detail = await res.text()
      throw new Error(`groq ${res.status}: ${detail.slice(0, 200)}`)
    }
    const json: any = await res.json()
    const msg = json.choices?.[0]?.message
    if (!msg) throw new Error('empty response')
    messages.push(msg)

    const calls = msg.tool_calls as
      | { id: string; function: { name: string; arguments: string } }[]
      | undefined
    if (!calls?.length) {
      const answer = (msg.content ?? '').replace(/<think>[\s\S]*?<\/think>/g, '').trim()
      if (!answer) throw new Error('empty answer')
      return answer
    }

    for (const c of calls) {
      let result: string
      try {
        result = await runTool(userId, c.function.name, JSON.parse(c.function.arguments || '{}'))
      } catch {
        result = 'tool error'
      }
      messages.push({ role: 'tool', tool_call_id: c.id, content: result })
    }
  }
  throw new AppError(502, 'agent went in circles, try again')
}
