
import Link from "next/link"
// import { getSessionUser } from "@/lib/firebase-admin"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button";
import { SendMailForm } from "@/components/SendMailForm"
import { Badge } from "../ui/badge"

interface TeamCardProps extends React.HTMLAttributes<HTMLElement> {
  contributor: {
    id: string
    name: string
    email: string
    tags: string[]
    bio: string
  }
}

export function ContributorCard({ className, contributor, ...props }: TeamCardProps) {
  return (
    <Card className="shadow">
      <CardContent className="h-full">
        <div key={contributor.id} className="p-4 rounded flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between w-full mb-5">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{contributor.name.split(' ').map(word => word[0].toUpperCase()).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-bold leading-none">{contributor.name}</p>
              </div>
            </div>
            <div className="w-full mb-5 text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: contributor.bio ?? '' }} />
            <div className="flex flex-wrap w-full mb-5">
              {contributor.tags[0].split(', ').map((tag: string, index: number) => <Badge key={index} className="mr-1 mb-1">{tag.slice(1, -1)}</Badge>)}
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">Message</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-8 my-2">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-bold leading-none">{contributor.name}</h4>
                  <SendMailForm senderEmail={'notis@kakehashi.io'} recepientEmail={contributor.email} />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}
