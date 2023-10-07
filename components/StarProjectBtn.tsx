"use client"

import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface StarProjectBtnProps extends React.HTMLAttributes<HTMLElement> {
  projectId: string,
  stars: number,
  isFavorited: boolean
}

export function StarProjectBtn({
  className,
  projectId,
  stars,
  isFavorited,
  ...props
}: StarProjectBtnProps) {
  const starClickHandler = async () => {
    const url = `/api/projects/${projectId}`
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`fetchORCIDToken ${response.status.toString()}`);
      }

      const data = await response.json();
      return data.access_token as string;
    } catch (error) {
      console.error("Error", error);
    }
  }

  const [isStarred, setIsStarred] = useState<boolean>(isFavorited);
  const [numStars, setNumStars] = useState<number>(stars)
  const changeStar = () => {
    if (isStarred) {
      setIsStarred(false);
      starClickHandler()
      setNumStars(numStars - 1)
    } else {
      setIsStarred(true);
      starClickHandler()
      setNumStars(numStars + 1)
    }
  }
  return (
    <>
      <Button
        variant='secondary'
        onClick={() => changeStar()}
        className={cn("hover:bg-gray-50 transform transition-transform duration-300 hover:scale-110 cursor-pointer shadow", className)}
        {...props}
      >
        {numStars}
        <StarFilledIcon className={`ml-1 h-4 w-4 ${isStarred ? 'text-[blue] fill-[blue]' : 'text-black'}`} />
      </Button>
    </>
  )
}