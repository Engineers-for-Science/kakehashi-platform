import {
  searchContributorIdsByProjectId,
  searchProjectIdsByContributorId,
  searchProjectIdsByPresetKeyword,
} from "./pinecone";
import { sql } from "@vercel/postgres";

const getYourMatchedProjects = async (
  contributorId: string,
  howmany: number
) => {
  const matches = (
    await searchProjectIdsByContributorId(contributorId, howmany)
  ).matches;
  const projectIds = matches ? matches.map((match) => match.id) : [];
  const projects =
    // @ts-expect-error
    await sql`select project.*, COALESCE(favorite.count, 0) AS count from project LEFT JOIN favorite ON project.project_id = favorite.project_id where project.project_id = any (${projectIds});`;
  return projects.rows;
};

const getProjectsByPresetKeyword = async (
  keyword:
    | "Aerospace"
    | "AI and Machine Learning"
    | "Chemistry"
    | "Biotech"
    | "Environment",
  howmany: number
) => {
  const matches = (await searchProjectIdsByPresetKeyword(keyword, howmany))
    .matches;
  const projectIds = matches ? matches.map((match) => match.id) : [];
  const projects =
    // @ts-expect-error
    await sql`select project.*, COALESCE(favorite.count, 0) AS count from project LEFT JOIN favorite ON project.project_id = favorite.project_id where project.project_id = any (${projectIds});`;
  return projects.rows;
};

const getPotentialContributors = async (projectId: string, howmany: number) => {
  const matches = (await searchContributorIdsByProjectId(projectId, howmany))
    .matches;
  const contributorIds = matches ? matches.map((match) => match.id) : [];
  const contributors =
    await sql`select * from contributor where id IN (${contributorIds.toString()});`;
  return contributors.rows;
};

export {
  getYourMatchedProjects,
  getPotentialContributors,
  getProjectsByPresetKeyword,
};
