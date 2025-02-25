import { AnthropicStream, StreamingTextResponse } from 'ai';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    stream: true,
    messages: messages,
    max_tokens: 1024,
  });

  const stream = AnthropicStream(response);
  return new StreamingTextResponse(stream);
}
