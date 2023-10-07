import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getSessionUser } from "@/lib/firebase-admin"
import { sql } from "@vercel/postgres"
import Link from "next/link"

export async function UserNav() {
  // const user = {
  //   id: 'bjkdskjhbsdjhk',
  //   name: 'Display Name',
  //   email: 'email@example.com'
  // }

  const currentSession = await getSessionUser()
  if (!currentSession) {
    return <>Unauthorized</>
  }
  const userId = currentSession.uid
  const user = (await sql`select * from contributor where id = ${userId};`).rows[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="@name" />
            <AvatarFallback>{user?.name.split(' ').map((word: any) => word[0].toUpperCase()).join('')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href='/profile'>
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
          </Link>
          <Link href='/settings'>
            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
          </Link>
          {/* <Link href='/create-project'>
            <DropdownMenuItem>
              Create a Project
            </DropdownMenuItem>
          </Link> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href='/'>
          <DropdownMenuItem>
            Logout
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
