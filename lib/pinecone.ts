import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey: "0c0ee033-76b3-4941-9198-ddd2111968e9",
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
};
