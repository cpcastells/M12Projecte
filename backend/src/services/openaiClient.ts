import OpenAI from "openai";

let client: OpenAI | null = null;

/**
 * Retorna una instància singleton del client d'OpenAI.
 *
 * Llegeix `OPENAI_API_KEY` de les variables d'entorn. La instància es cacheja a nivell de
 * mòdul: les crides posteriors reutilitzen el mateix client.
 *
 * @throws Error si `OPENAI_API_KEY` no està definida a l'entorn.
 * @returns Client d'OpenAI llest per fer crides a l'API.
 */
export const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY no definida a l'entorn");
  }

  if (!client) {
    client = new OpenAI({
      apiKey,
    });
  }

  return client;
};
