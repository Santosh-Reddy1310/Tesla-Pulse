'use client'

import { useState } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AssistantPage() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE

  const handleSend = async () => {
    if (!query.trim()) return
    setLoading(true)
    setResponse('')
    try {
      const stockRes = await axios.get(`${BASE_URL}/stock`)
      const stock = stockRes.data.data?.[0]

      const context = `Today, Tesla stock opened at $${stock.open}, peaked at $${stock.high}, dipped to $${stock.low}, and closed at $${stock.close}.`
      const prompt = `${context} Based on this, ${query}`

      const res = await axios.post(`${BASE_URL}/chat`, { message: prompt })
      const aiReply = res.data.response

      setHistory((prev) => [
        ...prev,
        `🧑‍💻 You: ${query}`,
        aiReply ? `🤖 Gemini: ${aiReply}` : '🤖 Gemini: (No response)'
      ])
      setQuery('')
      setResponse(aiReply)
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        `🧑‍💻 You: ${query}`,
        '🤖 Gemini: Sorry, something went wrong.'
      ])
      console.error('Chat error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">AI Assistant Panel</h2>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about Tesla stock, market trends, or anything..."
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !query.trim()}>
            {loading ? 'Thinking...' : 'Ask Gemini'}
          </Button>

          <div className="bg-muted p-4 rounded-md space-y-2 max-h-[300px] overflow-y-auto">
            {history.map((line, index) => (
              <p key={index} className="text-sm whitespace-pre-line">
                {line}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
