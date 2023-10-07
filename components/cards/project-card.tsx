import { cn } from "@/lib/utils"
import Link from "next/link"

import { StarIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps extends React.HTMLAttributes<HTMLElement> {
  id: string,
  title: string,
  description: string,
  tags: string[],
  status: string,
  stars: number,
}

export function ProjectCard({
  className,
  id,
  title,
  description,
  tags,
  status,
  stars,
  ...props
}: ProjectCardProps) {
  return (
    <Link href={`/home/projects/${id}`}>
      <Card
        className={cn("hover:bg-gray-50 cursor-pointer shadow", className)}
        {...props}
      >
        <CardHeader className="grid grid-cols-[1fr_60px] items-start gap-2 space-y-0">
          <div className="space-y-1">
            <CardTitle>{title ?? ''}</CardTitle>
            <CardDescription>
              {description && description.length > 200 ? description.slice(0, 200) + '...' : description ?? ''}
            </CardDescription>
          </div>
          <div className="flex items-center justify-center text-sm p-1 border rounded">
            <StarIcon className="mr-1 h-3 w-3" />
            {stars ?? 0}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center mb-2">
              {tags.map((tag: string, index: number) => <Badge key={index} className="mr-1 mb-1">{tag.slice(1, -1)}</Badge>)}
            </div>
            <div>
              <Badge
                className={`${status === 'active' ? 'bg-green-400' : status === 'complete' ? 'bg-blue-400' : 'bg-orange-400'}`}
              >
                Status: {status ?? 'Unknown'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card >
    </Link>
  )
}
