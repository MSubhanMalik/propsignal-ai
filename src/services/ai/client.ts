import OpenAI from "openai";

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://propsignal.vercel.app",
    "X-Title": "PropSignal AI",
  },
});

export const MODEL = "anthropic/claude-sonnet-4-5";

export async function chat(system: string, user: string): Promise<string> {
  const msg = await openrouter.chat.completions.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return msg.choices[0]?.message?.content ?? "";
}
