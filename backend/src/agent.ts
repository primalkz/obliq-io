import { AppError } from './errors'
import { tools, runTool } from './agent-tools'

const URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'qwen/qwen3.6-27b'

const system = `you are the obliq agent inside a compliance ops dashboard for an indian CA firm.
today is ${new Date().toISOString().slice(0, 10)}.
the dashboard has three tabs: calendar (filings list, each filing has a detail page at
/filings/{id} with mark filed and delete), clients (client list with gstin and overdue counts)
and settings.
you answer questions about the firm clients, filings and deadlines using the tools, never
invent data. when pointing at a filing, answer with a short sentence plus a markdown link like
[GSTR-3B - Nandi Logistics](/filings/abc123) using the id from the tool output, so the ui can
render it clickable. keep answers short and direct, plain language, no greetings.`

export async function askAgent(
  userId: string,
  question: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
): Promise<string> {
  const messages: any[] = [
    { role: 'system', content: system },
    ...history.slice(-6),
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
