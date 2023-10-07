import Link from "next/link"
import { getSessionUser } from "@/lib/firebase-admin"

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

interface TeamCardProps extends React.HTMLAttributes<HTMLElement> {
  members: {
    id: string
    name: string
    email: string
    role: string
  }[]
}

export async function TeamCard({ className, members, ...props }: TeamCardProps) {
  // const user = await getSessionUser()
  // console.log(user)
  // if (!user) {
  //   return <>Unauthorized</>
  // }
  return (
    <Card className="shadow">
      <CardHeader>
        <CardTitle className="text-md font-bold py-0">Team Members</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-0">
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between space-x-4 py-2 rounded">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{member.name.split(' ').map(word => word[0].toUpperCase()).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Message</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 mr-8 my-2">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-bold leading-none">{member.name}</h4>
                    <SendMailForm senderEmail="test@test.com" recepientEmail={member.email} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
