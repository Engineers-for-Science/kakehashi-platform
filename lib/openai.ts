const GPT_ENDPOINT = "https://api.openai.com/v1/completions";
const EMBEDDING_ENDPOINT = "https://api.openai.com/v1/embeddings";
const API_KEY = "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";

const callCompletions = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(GPT_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        max_tokens: 256,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI Completions API responded with status: ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data && data.choices && data.choices[0]) {
      return data.choices[0].text.trim();
    } else {
      throw new Error("Invalid response from OpenAI API.");
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
};

const callEmbeddings = async (tags: string[]) => {
  try {
    const response = await fetch(EMBEDDING_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: tags,
        model: "text-embedding-ada-002",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI Embeddings APIresponded with status: ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.data) {
      return data.data;
    } else {
      throw new Error("Invalid response from OpenAI API.");
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
};

export { callCompletions, callEmbeddings };
