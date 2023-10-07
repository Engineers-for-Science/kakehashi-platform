import { NextResponse } from "next/server";
import { callCompletions, callEmbeddings } from "@/lib/openai";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey: "0c0ee033-76b3-4941-9198-ddd2111968e9",
});

type Message = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  name: string;
  orcid: string;
};

const fetchORCIDAccessToken = async () => {
  const url = "https://sandbox.orcid.org/oauth/token";
  const headers = {
    Accept: "application/json",
  };
  const bodyData = new URLSearchParams({
    client_id: "APP-5A5ZHRGOPGYQE8RL",
    client_secret: "9a79634e-2757-4f4a-8fa2-bb5cbff6e7c9",
    grant_type: "client_credentials",
    scope: "/read-public",
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: bodyData,
    });
    if (!response.ok) {
      throw new Error(`fetchORCIDToken ${response.status.toString()}`);
    }

    const data = await response.json();
    return data.access_token as string;
  } catch (error) {
    console.error("Error", error);
  }
};

async function fetchORCRecord(orcId: string, accessToken: string) {
  const url = `https://pub.sandbox.orcid.org/v2.1/${orcId}/record`;
  const headers = {
    "Content-Type": "application/vnd.orcid+json",
    Authorization: `Bearer ${accessToken}`,
  };
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`fetchORCRecord ${response.status.toString()}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error", error);
  }
}

export async function GET(
  request: Request,
  { params }: { params: { orcid: string } }
) {
  const orcid = params.orcid;
  const token = await fetchORCIDAccessToken();
  const record = await fetchORCRecord(orcid, token!);

  // educations top 10
  const educationsJson = record["activities-summary"].educations[
    "education-summary"
  ].slice(0, 10);
  const educationsList = educationsJson.map((educationJson: any) => {
    return `Department: ${educationJson["department-name"]}, Role: ${educationJson["role-title"]}`;
  });

  // employments top 10
  const employmentsJson = record["activities-summary"].employments[
    "employment-summary"
  ].slice(0, 10);
  const employmentsList = employmentsJson.map((employmentJson: any) => {
    return `Department: ${employmentJson["department-name"]}, Role: ${employmentJson["role-title"]}`;
  });

  // works top 10
  const worksJson = record["activities-summary"].works.group.slice(0, 20);
  const worksList = worksJson.map((workJson: any) => {
    return workJson["work-summary"][0].title.title.value;
  });

  const records = {
    educations: educationsList,
    employments: employmentsList,
    works: worksList,
  };

  const prompt = `
Extract tags which represents him/her specialities.
Number of tags should be within 10.

OUTPUT ONLY TAGS!!
TAGS MUST BE LIST FORMAT!!

example:
[
  'tag1',
  'tag2',
  ...
]

"His/Her educations"
${records.educations}

"His/Her employments"
${records.employments}

"His/Her works"
${records.works}

DON'T SAY ANYTHING, JUST OUTPUT TAGS PLEASE.
  `;

  // extract tags from raw data from ORCID record
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
      id: orcid,
      values: embedding.embedding,
      metadata: {
        type: "contributor",
      },
    };
  });

  // and store embeddings to vector DB.
  const index = pinecone.Index("skills");
  await index.upsert(pineconeRecords);

  return NextResponse.json(formattedTags);
}
