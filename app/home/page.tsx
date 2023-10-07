import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "../../components/cards/project-card";
import { getSessionUser } from "@/lib/firebase-admin";
import { getProjectsByPresetKeyword, getYourMatchedProjects } from "@/lib/vectorSearch";
import { sql } from "@vercel/postgres";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default async function Home() {
  const user = await getSessionUser()
  if (!user) {
    return <>Unauthorized</>
  }

  const results = await Promise.all([
    getYourMatchedProjects(user.uid, 3),
    getProjectsByPresetKeyword('Aerospace', 3),
    getProjectsByPresetKeyword('AI and Machine Learning', 3),
    getProjectsByPresetKeyword('Chemistry', 3),
    getProjectsByPresetKeyword('Biotech', 3),
    getProjectsByPresetKeyword('Environment', 3),
    sql`
  SELECT 
    project.*, 
    COALESCE(favorite.count, 0) AS count
  FROM 
    project
  LEFT JOIN 
    favorite ON project.project_id = favorite.project_id
  ORDER BY 
    project.start_date DESC 
  LIMIT 3;
  `,
    sql`
  SELECT 
    project.*, 
    COALESCE(favorite.count, 0) AS count
  FROM 
    project
  LEFT JOIN 
    favorite ON project.project_id = favorite.project_id
  ORDER BY 
  count DESC 
  LIMIT 3;
  `,
  ]);

  const yourMatchedProjects = results[0];
  const aerospaceProjects = results[1];
  const aimlProjects = results[2];
  const chemiProjects = results[3];
  const bioProjects = results[4];
  const envProjects = results[5];
  const newProjects = results[6].rows;
  const popularProjects = results[7].rows;

  return (
    <>
      <div className="p-6">

        <div className="mb-2 text-2xl font-bold">
          🔎 Your Matched Projects 🔎
          {' '}<a href={`/home/categories/matched`} className="underline text-sm">see more...</a>
        </div>
        <Separator className="mb-4" />
        <div className="mb-10 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
          {yourMatchedProjects.map(project => (
            <ProjectCard
              key={project.project_id}
              id={project.project_id}
              title={project.project_name}
              description={project.description}
              tags={project.tags[0].split(', ')}
              status={project.status}
              stars={project.count}
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold">
          ✨ Popular Projects ✨
          {' '}<a href={`/home/categories/popular`} className="underline text-sm">see more...</a>
        </div>
        <Separator className="mb-4" />
        <div className="mb-10 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
          {popularProjects.map(project => (
            <ProjectCard
              key={project.project_id}
              id={project.project_id}
              title={project.project_name}
              description={project.description}
              tags={project.tags[0].split(', ')}
              status={project.status}
              stars={project.count}
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold">
          🔥 New Projects 🔥
          {' '}<a href={`/home/categories/new`} className="underline text-sm">see more...</a>
        </div>
        <Separator className="mb-4" />
        <div className="mb-10 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
          {newProjects.map(project => (
            <ProjectCard
              key={project.project_id}
              id={project.project_id}
              title={project.project_name}
              description={project.description}
              tags={project.tags[0].split(', ')}
              status={project.status}
              stars={project.count}
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold">
          🚀 Aerospace Projects 🚀
          {' '}<a href={`/home/categories/aerospace`} className="underline text-sm">see more...</a>
        </div>
        <Separator className="mb-4" />
        <div className="mb-10 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
          {aerospaceProjects.map(project => (
            <ProjectCard
              key={project.project_id}
              id={project.project_id}
              title={project.project_name}
              description={project.description}
              tags={project.tags[0].split(', ')}
              status={project.status}
              stars={project.count}
            />
          ))}
        </div>
        <div className="mb-2 text-2xl font-bold">
          👾 AI/ML Projects 👾
          {' '}<a href={`/home/categories/ai`} className="underline text-sm">see more...</a>
        </div>
        <Separator className="mb-4" />
        <div className="mb-10 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
          {aimlProjects.map(project => (
            <ProjectCard
              key={project.project_id}
              id={project.project_id}
              title={project.project_name}
              description={project.description}
              tags={project.tags[0].split(', ')}
              status={project.status}
              stars={project.count}
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold">
          🧪 Chemistry Projects 🧪
          {' '}<a href={`/home/categories/chemistry`} className="underline text-sm">see more...</a>
        </div>
        <Separator className="mb-4" />
        <div className="mb-10 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
          {chemiProjects.map(project => (
            <ProjectCard
              key={project.project_id}
              id={project.project_id}
              title={project.project_name}
              description={project.description}
              tags={project.tags[0].split(', ')}
              status={project.status}
              stars={project.count}
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold">
          🧬 Biotech Projects 🧬
          {' '}<a href={`/home/categories/biotech`} className="underline text-sm">see more...</a>
        </div>
        <Separator className="mb-4" />
        <div className="mb-10 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
          {bioProjects.map(project => (
            <ProjectCard
              key={project.project_id}
              id={project.project_id}
              title={project.project_name}
              description={project.description}
              tags={project.tags[0].split(', ')}
              status={project.status}
              stars={project.count}
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold">
          🌎 Environmental Projects 🌎
          {' '}<a href={`/home/categories/environmental`} className="underline text-sm">see more...</a>
        </div>
        <Separator className="mb-4" />
        <div className="mb-10 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
          {envProjects.map(project => (
            <ProjectCard
              key={project.project_id}
              id={project.project_id}
              title={project.project_name}
              description={project.description}
              tags={project.tags[0].split(', ')}
              status={project.status}
              stars={project.count}
            />
          ))}
        </div>
      </div>
    </>
  );
}