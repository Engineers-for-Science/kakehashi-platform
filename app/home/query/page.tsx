import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/cards/project-card";
import { Input } from "@/components/ui/input";
import { ArrowBigRight, CheckCheckIcon, SearchCheckIcon, SearchIcon } from "lucide-react";
import LoadingCard from "@/components/cards/loading-card";


export default function Browse() {
  const projects = [
    {
      id: 'jbsdhsbdj',
      title: 'Example Project',
      description: 'This is an example project for the purpose of developing this ui.',
      category: 'Space & Science',
      lastUpdated: 'April 14, 2023',
      stars: 69
    },
    {
      id: 'jbsdhsbdj',
      title: 'Example Project',
      description: 'This is an example project for the purpose of developing this ui.',
      category: 'Space & Science',
      lastUpdated: 'April 14, 2023',
      stars: 69
    },
    {
      id: 'jbsdhsbdj',
      title: 'Example Project',
      description: 'This is an example project for the purpose of developing this ui.',
      category: 'Space & Science',
      lastUpdated: 'April 14, 2023',
      stars: 69
    },
  ]
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
          />
          <Button variant='secondary' className="shadow"><SearchIcon /></Button>
        </div>
        <div className="md:p-6 mt-4 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
          {/* {projects.map(project => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              category={project.category}
              lastUpdated={project.lastUpdated}
              stars={project.stars}
            />
          ))} */}
          {Array(6).fill(6).map((card, index) => (<LoadingCard key={index} />))}
        </div>
      </div>
    </>
  );
}