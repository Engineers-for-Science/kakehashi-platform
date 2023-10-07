import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link";

import { MainNav } from "@/components/nav/main-nav"
import { Search } from "@/components/nav/search";
import { UserNav } from "@/components/nav/user-nav";

export const metadata: Metadata = {
  title: "Kakehashi | Create Project",
  description: "Explore projects, connect with other researchers, and view your projects.",
}

const mainNavItems = [
  {
    title: "Browse",
    href: "/home",
  },
  {
    title: "Query",
    href: "/home/query",
  },
  {
    title: "My Projects",
    href: "/home/my-projects",
  },
]

interface CreateProjectLayoutProps {
  children: React.ReactNode
}

export default function CreateProjectLayout({ children }: CreateProjectLayoutProps) {
  return (
    <>
      <div className="md:block h-screen">
        <div className="flex flex-col h-full">
          <div className="border-b">
            <div className="flex h-16 items-center px-2">
              <div className="flex items-center font-bold text-sm md:text-2xl py-1 px-1 md:px-2">
                <Image
                  src='/kakehashi.png'
                  width={30}
                  height={30}
                  alt="Kakehashi Logo"
                  className="rounded w-6 h-6 mr-0.5"
                />
                akehashi
              </div>
              <MainNav className="mx-2 md:mx-6 flex" items={mainNavItems} />
              <div className="ml-auto flex items-center space-x-2 md:space-x-4 md:mr-2">
                <div className="hidden md:block"><Search /></div>
                <UserNav />
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
