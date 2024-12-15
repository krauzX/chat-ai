import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class Assistant {
  #model;

  constructor(model = "gpt-4o-mini") {
    this.#model = model;
  }

  async chat(content, history) {
    try {
      const result = await openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        max_tokens: 20,
      });

      return result.choices[0].message.content;
    } catch (error) {
      if (error == 429) {
        throw new Error("error too many request");
      }

      throw error;
    }
  }
}
