import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "../../../components/cards/project-card";
import LoadingCard from "@/components/cards/loading-card";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { sql } from "@vercel/postgres";
import { getSessionUser } from "@/lib/firebase-admin";
import { useRouter } from "next/navigation";


export default async function MyProjects() {
  const currentSession = await getSessionUser()
  if (!currentSession) {
    return <></>
  }
  const userId = currentSession.uid
  const user = (await sql`select * from contributor where id = ${userId};`).rows[0]
  const projects = (await sql`
    SELECT p.*
    FROM contributor c
    JOIN LATERAL UNNEST(c.fav_projects) AS fav_project_id
    ON TRUE
    JOIN project p
    ON p.project_id = fav_project_id
    WHERE c.id = ${userId};
  `).rows;


  if (projects.length === 0) return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <div className="text-md">
          Looks like you have no starred projects! You can {' '}
          <a href="/home" className="underline">see matched projects here</a> or {' '}
          <a href="/home/query" className="underline">query projects here.</a>
        </div>
      </div>
    </>
  )

  return (
    <>
      <div className="p-10 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
        <div className="md:col-span-2 md:row-span-2 flex flex-col justify-center items-center">
          <div className="">
            <div className="text-[35px] md:text-[75px] font-bold">My Projects</div>
            <div className="text-md">
              Query your starred projects with natural language.
            </div>
            <div className="mt-2 flex justify-start items-center">
              <Input
                type="search"
                placeholder="Projects about space agriculture?"
                className="shadow mr-2"
              />
              <Button variant='secondary' className="shadow"><SearchIcon /></Button>
            </div>
          </div>
        </div>
        {projects.map(project => (
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
    </>
  );
}