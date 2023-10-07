import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey: "0c0ee033-76b3-4941-9198-ddd2111968e9",
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url")!;

  const index = pinecone.Index("skills");
  console.log(url);
  const result = await index.query({
    topK: 3,
    id: url,
    filter: { type: "contributor" },
  });
  return NextResponse.json(result.matches);
}
