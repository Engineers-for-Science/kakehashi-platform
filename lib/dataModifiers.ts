import { fetchORCIDAccessToken, fetchORCRecord } from "@/lib/orcid";
import { callCompletions, callEmbeddings } from "@/lib/openai";
import { pineconeUpsert } from "@/lib/pinecone";
import { createSummaryByURL } from "./sumy";

const createPromptFromRecord = (record: any) => {
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

  return prompt;
};

const createPromptFromSummary = (summary: string, description: string) => {
  const prompt = `
Please extract a list of skills that members would likely be required to have for the execution of this project as tags.
When extracting skills, please avoid using abstract terms like "organization", "communication", and use specific and professional terms.
Number of tags MUST be within 10.
It's perfectly fine if there are fewer than 10, so if you don't come up with good word, I don't need that tag.

OUTPUT ONLY TAGS!!
TAGS MUST BE LIST FORMAT!!

example:
[
  'tag1',
  'tag2',
  ...
]

Project:
${description}
${summary}

DON'T SAY ANYTHING, JUST OUTPUT TAGS PLEASE.
  `;
  return prompt;
};

const createVectorFromTags = async (
  id: string,
  tags: string[],
  type: "contributor" | "project"
) => {
  // get embeddings by each tag, for instance there are 10 tags, you can get 10 embeddings.
  const embeddings = await callEmbeddings([tags.toString()]);
  const pineconeRecords = embeddings.map((embedding: any) => {
    return {
      id: id,
      values: embedding.embedding,
      metadata: {
        type: type,
      },
    };
  });

  const pineconePromise = pineconeUpsert(pineconeRecords);
  return pineconePromise;
};

const formatTags = (tags: string) => {
  const formattedTags = tags
    .replace(/\[|\]/g, "")
    .split(",")
    .map((item) => item.trim().replace(/^'(.+)'$/, "$1"))
    .filter((item) => item !== "");
  return formattedTags;
};

const extractTagsFromORCID = async (orcid: string) => {
  const token = await fetchORCIDAccessToken();
  const record = await fetchORCRecord(orcid, token!);
  const validEmails = record.person.emails.email.filter(
    (email: any) => email.verified && email.primary
  );
  const email = validEmails.length > 0 ? validEmails[0].email : "";
  const prompt = createPromptFromRecord(record);

  const tags = await callCompletions(prompt);
  return { tags: formatTags(tags), email: email };
};

const extractTagsFromProjectURL = async (url: string, description: string) => {
  const summary = (await createSummaryByURL(url)) || "";
  console.log(summary);
  const prompt = createPromptFromSummary(summary, description);
  const tags = await callCompletions(prompt);
  return formatTags(tags);
};

export {
  extractTagsFromORCID,
  createVectorFromTags,
  extractTagsFromProjectURL,
};
