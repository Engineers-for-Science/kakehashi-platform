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
  // if (!user) {
  //   return <>Unauthorized</>
  // }
  const results = await Promise.all([
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
  const matchedResults = async () => {
    if (!user) return []
    return await getYourMatchedProjects(user.uid, 3)
  }

  const yourMatchedProjects = await matchedResults();
  const aerospaceProjects = results[0];
  const aimlProjects = results[1];
  const chemiProjects = results[2];
  const bioProjects = results[3];
  const envProjects = results[4];
  const newProjects = results[5].rows;
  const popularProjects = results[6].rows;

  return (
    <>
      <div className="p-6">

        {!user ? <></> : <>
          <div className="mb-2 text-2xl font-bold rounded-lg backdrop-blur-sm bg-gray-100/90 px-6 py-3 shadow flex justify-between items-center md:w-2/3">
            🔎 Your Matched Projects 🔎
            <a href={`/home/categories/matched`} className="underline text-sm">see more...</a>
          </div>

          <div className="mb-10 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
            {yourMatchedProjects ? <>{yourMatchedProjects.map(project => (
              <ProjectCard
                key={project.project_id}
                id={project.project_id}
                title={project.project_name}
                description={project.description}
                tags={project.tags[0].split(', ')}
                status={project.status}
                stars={project.count}
                className="h-full flex flex-col justify-between items-start"
              />
            ))}</> : <></>}
          </div>
        </>}

        <div className="mb-2 text-2xl font-bold rounded-lg backdrop-blur-sm bg-gray-100/90 px-6 py-3 shadow flex justify-between items-center md:w-2/3">
          ✨ Popular Projects ✨
          <a href={`/home/categories/popular`} className="underline text-sm">see more...</a>
        </div>

        <div className="mb-10 grid grid-auto-rows grid-cols-1 md:grid-cols-3 gap-2">
          {popularProjects.map(project => (
            <ProjectCard
              key={project.project_id}
              id={project.project_id}
              title={project.project_name}
              description={project.description}
              tags={project.tags[0].split(', ')}
              status={project.status}
              stars={project.count}
              className="h-full flex flex-col justify-between items-start"
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold rounded-lg backdrop-blur-sm bg-gray-100/90 px-6 py-3 shadow flex justify-between items-center md:w-2/3">
          🔥 New Projects 🔥
          <a href={`/home/categories/new`} className="underline text-sm">see more...</a>
        </div>

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
              className="h-full flex flex-col justify-between items-start"
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold rounded-lg backdrop-blur-sm bg-gray-100/90 px-6 py-3 shadow flex justify-between items-center md:w-2/3">
          🚀 Aerospace Projects 🚀
          <a href={`/home/categories/aerospace`} className="underline text-sm">see more...</a>
        </div>

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
              className="h-full flex flex-col justify-between items-start"
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold rounded-lg backdrop-blur-sm bg-gray-100/90 px-6 py-3 shadow flex justify-between items-center md:w-2/3">
          👾 AI/ML Projects 👾
          <a href={`/home/categories/ai`} className=" underline text-sm">see more...</a>
        </div >

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
              className="h-full flex flex-col justify-between items-start"
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold rounded-lg backdrop-blur-sm bg-gray-100/90 px-6 py-3 shadow flex justify-between items-center md:w-2/3">
          🧪 Chemistry Projects 🧪
          <a href={`/home/categories/chemistry`} className="underline text-sm">see more...</a>
        </div>

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
              className="h-full flex flex-col justify-between items-start"
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold rounded-lg backdrop-blur-sm bg-gray-100/90 px-6 py-3 shadow flex justify-between items-center md:w-2/3">
          🧬 Biotech Projects 🧬
          <a href={`/home/categories/biotech`} className="underline text-sm">see more...</a>
        </div>

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
              className="h-full flex flex-col justify-between items-start"
            />
          ))}
        </div>

        <div className="mb-2 text-2xl font-bold rounded-lg backdrop-blur-sm bg-gray-100/90 px-6 py-3 shadow flex justify-between items-center md:w-2/3">
          🌎 Environmental Projects 🌎
          <a href={`/home/categories/environmental`} className="underline text-sm">see more...</a>
        </div>

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
              className="h-full flex flex-col justify-between items-start"
            />
          ))}
        </div>
      </div >
    </>
  );
}