import {
  createVectorFromTags,
  extractTagsFromDescription,
  extractTagsFromOnlyProjectURL,
} from "@/lib/dataModifiers";
import { callEmbeddings } from "@/lib/openai";
import { searchContributorIdsByVector } from "@/lib/pinecone";
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { describe } from "node:test";

const fetchAccessToken = async (authorizationCode: string) => {
  const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";
  const clientId = "86h4m01yn21lk0";
  const clientSecret = "JXM7YpkvbqOAmKV0";
  const redirectUri =
    "https://kakehashi-platform.vercel.app/api/sessionLoginLinkedIn";

  const requestBody = new URLSearchParams();
  requestBody.append("grant_type", "authorization_code");
  requestBody.append("code", authorizationCode);
  requestBody.append("redirect_uri", redirectUri);
  requestBody.append("client_id", clientId);
  requestBody.append("client_secret", clientSecret);

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: requestBody.toString(),
  });

  const credential = await response.json();

  if (response.ok) {
    return credential;
  } else {
    throw new Error(
      credential.error_description || "Unable to fetch access token"
    );
  }
};

export async function POST(request: Request) {
  const body = await request.json();
  if (body.url) {
    const tags = await extractTagsFromOnlyProjectURL(body.url);
    const serializedTag = tags.map((tag) => `'${tag}'`).join(", ");
    const embeddings = await callEmbeddings([serializedTag]);
    const embedding = embeddings[0].embedding;
    const matches = (await searchContributorIdsByVector(embedding, 3)).matches;
    const contributorIds = matches ? matches.map((record) => record.id) : [];
    const contributors =
      // @ts-expect-error
      await sql`select * from contributor where id = any (${contributorIds});`;
    const sorted = contributors.rows.sort(
      (a, b) =>
        contributorIds.indexOf(a.id.toString()) -
        contributorIds.indexOf(b.id.toString())
    );
    return NextResponse.json({
      contributors: sorted,
      skills: tags,
    });
  } else {
    const tags = await extractTagsFromDescription(body.description);
    const serializedTag = tags.map((tag) => `'${tag}'`).join(", ");
    const embeddings = await callEmbeddings([serializedTag]);
    const embedding = embeddings[0].embedding;
    const matches = (await searchContributorIdsByVector(embedding, 3)).matches;
    const contributorIds = matches ? matches.map((record) => record.id) : [];
    const contributors =
      // @ts-expect-error
      await sql`select * from contributor where id = any (${contributorIds});`;
    const sorted = contributors.rows.sort(
      (a, b) =>
        contributorIds.indexOf(a.id.toString()) -
        contributorIds.indexOf(b.id.toString())
    );
    return NextResponse.json({
      contributors: sorted,
      skills: tags,
    });
  }
}
