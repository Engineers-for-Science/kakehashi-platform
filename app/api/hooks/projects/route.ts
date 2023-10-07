import { NextResponse } from "next/server";
import { callCompletions, callEmbeddings } from "@/lib/openai";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey: "0c0ee033-76b3-4941-9198-ddd2111968e9",
});

async function fetchSummary(targetUrl: string) {
  const apiEndpoint = `https://radiant-bastion-00842-4c8a23b99d07.herokuapp.com/url?url=${targetUrl}&length=10`;
  const headers = {
    Accept: "application/json",
  };
  try {
    const response = await fetch(apiEndpoint, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`fetchReadme ${response.status.toString()}`);
    }

    return await response.text();
  } catch (error) {
    console.log("Error", error);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url")!;
  const summary = await fetchSummary(url);

  const prompt = `
Extract tags which represents "required skills" for that project.
Number of tags should be within 10.

OUTPUT ONLY TAGS!!
TAGS MUST BE LIST FORMAT!!

example:
[
  'tag1',
  'tag2',
  ...
]

Project:
${summary}

DON'T SAY ANYTHING, JUST OUTPUT TAGS PLEASE.
  `;

  const tags = await callCompletions(prompt);
  const formattedTags = tags
    .replace(/\[|\]/g, "")
    .split(",")
    .map((item) => item.trim().replace(/^'(.+)'$/, "$1"))
    .filter((item) => item !== "");

  // get embeddings by each tag, for instance there are 10 tags, you can get 10 embeddings.
  const embeddings = await callEmbeddings([formattedTags.toString()]);
  const pineconeRecords = embeddings.map((embedding: any) => {
    return {
      id: url,
      values: embedding.embedding,
      metadata: {
        type: "project",
      },
    };
  });

  // and store embeddings to vector DB.
  const index = pinecone.Index("skills");
  await index.upsert(pineconeRecords);

  return NextResponse.json(formattedTags);
}
