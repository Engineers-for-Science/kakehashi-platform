import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/cards/project-card";
import { Input } from "@/components/ui/input";
import { ArrowBigRight, CheckCheckIcon, SearchCheckIcon, SearchIcon } from "lucide-react";
import LoadingCard from "@/components/cards/loading-card";


export default function FindContributors() {

  return (
    <>
      <div className="p-6 md:pt-20">
        <div className="text-[20px] md:text-[40px] font-bold flex items-center md:justify-center">
          Find Skilled Contributors
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
          {Array(6).fill(6).map((card, index) => (<LoadingCard key={index} />))}
        </div>
      </div>
    </>
  );
}