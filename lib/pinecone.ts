import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey: process.env.PINECONE_APIKEY!,
});

const pineconeUpsert = (pineconeRecords: any) => {
  // and store embeddings to vector DB.
  const index = pinecone.Index("skills");
  const pineconePromise = index.upsert(pineconeRecords);
  return pineconePromise;
};

const searchContributorIdsByProjectId = (ProjectId: string, topK: number) => {
  const index = pinecone.Index("skills");
  return index.query({
    topK: topK,
    id: ProjectId,
    filter: {
      type: "contributor",
    },
  });
};

const searchProjectIdsByContributorId = (
  contributorId: string,
  topK: number
) => {
  const index = pinecone.Index("skills");
  return index.query({
    topK: topK,
    id: contributorId,
    filter: {
      type: "project",
    },
  });
};

const searchProjectIdsByPresetKeyword = (
  presetKeyword: string,
  topK: number
) => {
  const index = pinecone.Index("skills");
  return index.query({
    topK: topK,
    id: presetKeyword,
    filter: {
      type: "project",
    },
  });
};

const searchProjectIdsByVector = (vector: number[], topK: number) => {
  const index = pinecone.Index("skills");
  return index.query({
    topK: topK,
    vector: vector,
    filter: {
      type: "project",
    },
  });
};

const searchContributorIdsByVector = (vector: number[], topK: number) => {
  const index = pinecone.Index("skills");
  return index.query({
    topK: topK,
    vector: vector,
    filter: {
      type: "contributor",
    },
  });
};

const deleteProjectsFromPinecone = async () => {
  const index = pinecone.Index("skills");
  await index.deleteMany({ type: "project" });
};

export {
  pineconeUpsert,
  searchContributorIdsByProjectId,
  searchProjectIdsByContributorId,
  deleteProjectsFromPinecone,
  searchProjectIdsByPresetKeyword,
  searchProjectIdsByVector,
  searchContributorIdsByVector,
};
