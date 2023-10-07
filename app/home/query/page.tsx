'use client'

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/cards/project-card";
import { Input } from "@/components/ui/input";
import { ArrowBigRight, CheckCheckIcon, SearchCheckIcon, SearchIcon } from "lucide-react";
import LoadingCard from "@/components/cards/loading-card";
import { useState } from "react";

export default function Query() {
  const [projects, setProjects] = useState<any[]>([])
  const [input, setInput] = useState<string>('')

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const queryProjects = async () => {
    const url = `/api/projects/byKeyword?keyword=${input}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    setProjects((await response.json()).projects)
  }
  return (
    <>
      <div className="p-6 md:pt-20">
        <div className="text-[20px] md:text-[40px] font-bold flex items-center justify-center">
          <SearchCheckIcon className="w-10 h-10" /> Search <ArrowBigRight className="w-10 h-10" />
          Match <ArrowBigRight className="w-10 h-10" />
          Browse <CheckCheckIcon className="w-10 h-10 ml-0.5" />
        </div>
        <div className="text-md flex items-center justify-center">
          Query the Kakehashi vector search algorithm with natural language.
        </div>
        <div className="mt-4 flex justify-center items-center">
          <Input
            type="search"
            placeholder="Are there any open-source projects combining biotech and artificial intelligence?"
            className="md:w-1/2 shadow mr-2"
            onChange={onChangeInput}
          />
          <Button variant='secondary' className="shadow" onClick={queryProjects}><SearchIcon /></Button>
        </div>
        <div className="md:p-6 mt-4 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
          {projects.length === 0 ? Array(6).fill(6).map((card, index) => (<LoadingCard key={index} />)) :
            projects.map(
              (project) =>
                <ProjectCard
                  key={project.project_id}
                  id={project.project_id}
                  title={project.project_name}
                  description={project.description}
                  tags={project.tags[0].split(', ')}
                  status={project.status}
                  stars={project.count}
                />
            )}
        </div>
      </div>
    </>
  );
}