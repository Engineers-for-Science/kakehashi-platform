'use client'

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/cards/project-card";
import { Input } from "@/components/ui/input";
import { ArrowBigLeft, ArrowBigRight, ArrowLeft, CheckCheckIcon, SearchCheckIcon, SearchIcon } from "lucide-react";
import LoadingCard from "@/components/cards/loading-card";
import { useState } from "react";
import { ContributorCard } from "@/components/cards/contributor-card";


function isValidUrl(text: string): boolean {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(text);
}

export default function FindContributors() {
  const [contributors, setContributors] = useState<any[]>([])
  const [input, setInput] = useState<string>('')
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const queryContributors = async () => {
    setLoading(true)
    const url = `/api/contributors`
    const isURL = isValidUrl(input)
    const param: any = {}
    if (isURL) {
      param.url = input
    } else {
      param.description = input
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param)
    })
    const data = await response.json()
    const contributors = data.contributors
    const skills = data.skills
    setContributors(contributors)
    console.log(contributors)
    setSkills(skills)
    setLoading(false)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      queryContributors()
    }
  }

  return (
    <>
      <div className="p-6 md:pt-20">
        <div className="rounded-lg backdrop-blur-sm bg-white/90 p-4 shadow md:mx-7">

          <div className="text-[20px] md:text-[40px] font-bold flex items-center md:justify-center">
            Find Skilled Contributors
          </div>
          <div className="text-md flex items-center justify-center">
            <ArrowBigLeft /><div className="text-xl font-bold">Bidirectional Matching</div><ArrowBigRight />
            {/* <p>So, we provide potential contributor search feature for project owners.</p>
            <p>Try it out, KAKEHASHI NLP + Vector Search Engine by just putting URL!</p> */}
          </div>
          <div className="mt-4 flex justify-center items-center">
            <Input
              type="search"
              placeholder="Find me contributors with a background in organic chemistry."
              className="md:w-1/2 shadow mr-2"
              onChange={onChangeInput}
              onKeyUp={handleKeyUp}
            />
            <Button variant='secondary' className="shadow" onClick={() => queryContributors()}><SearchIcon /></Button>
          </div>
          <div className="md:p-6 mt-4 grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
            {/* This project seems to need those skills. {skills} */}
            {loading ?
              <>{Array(3).fill(3).map((card, index) => (<LoadingCard key={index} />))}</>
              :
              <>{contributors.length > 0 ? <>{contributors.map((contributor) => <ContributorCard contributor={contributor} />)}</> : <></>}</>
            }
          </div>
        </div>
      </div>
    </>
  );
}