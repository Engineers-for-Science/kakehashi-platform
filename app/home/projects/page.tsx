import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { sql } from "@vercel/postgres";
import { ProjectCard } from "../../../components/cards/project-card";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function Projects() {
  const projects = (await sql`SELECT * FROM project;`).rows;
  return (
    <>
      <div className="p-6 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.project_id}
            id={project.project_id}
            title={project.project_name}
            description={project.description}
            tags={project.tags[0].split(', ')}
            status={project.status}
            stars={0}
          />
        ))}
      </div>
    </>
  );
}