import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { callEmbeddings } from "@/lib/openai";
import { searchProjectIdsByVector } from "@/lib/pinecone";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")!;

  const embeddings = await callEmbeddings([keyword]);
  const vector = embeddings[0].embedding;

  const matches = (await searchProjectIdsByVector(vector, 6)).matches;
  const projectIds = matches ? matches.map((record) => record.id) : [];

  const projects =
    // @ts-expect-error
    await sql`select project.*, COALESCE(favorite.count, 0) AS count from project LEFT JOIN favorite ON project.project_id = favorite.project_id where project.project_id = any (${projectIds});`;

  return NextResponse.json({ projects: projects.rows });
}
