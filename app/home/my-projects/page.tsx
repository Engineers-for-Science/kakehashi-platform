import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "../../../components/cards/project-card";
import LoadingCard from "@/components/cards/loading-card";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";


export default function MyProjects() {
  const projects = [
    {
      id: 'jbsdhsbdj',
      title: 'Example Project',
      description: 'This is an example project for the purpose of developing this ui.',
      tags: ['Space & Science'],
      status: 'active',
      stars: 69
    },
    {
      id: 'jbsdhsbdj',
      title: 'Example Project',
      description: 'This is an example project for the purpose of developing this ui.',
      tags: ['Space & Science'],
      status: 'active',
      stars: 69
    },
    {
      id: 'jbsdhsbdj',
      title: 'Example Project',
      description: 'This is an example project for the purpose of developing this ui.',
      tags: ['Space & Science'],
      status: 'active',
      stars: 69
    },
    {
      id: 'jbsdhsbdj',
      title: 'Example Project',
      description: 'This is an example project for the purpose of developing this ui.',
      tags: ['Space & Science'],
      status: 'active',
      stars: 69
    },
    {
      id: 'jbsdhsbdj',
      title: 'Example Project',
      description: 'This is an example project for the purpose of developing this ui.',
      tags: ['Space & Science'],
      status: 'active',
      stars: 69
    },
    {
      id: 'jbsdhsbdj',
      title: 'Example Project',
      description: 'This is an example project for the purpose of developing this ui.',
      tags: ['Space & Science'],
      status: 'active',
      stars: 69
    },
  ];

  if (projects.length === 0) return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <div className="text-md">
          Looks like you have no starred projects! You can {' '}
          <a href="/home" className="underline">see popular projects here</a> or {' '}
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
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            status={project.status}
            tags={project.tags}
            stars={project.stars}
          />
        ))}
      </div>
    </>
  );
}