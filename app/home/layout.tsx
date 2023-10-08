import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link";

import { MainNav } from "@/components/nav/main-nav"
import { Search } from "@/components/nav/search";
import { UserNav } from "@/components/nav/user-nav";
import DonateBtn from "@/components/DonateBtn";

export const metadata: Metadata = {
  title: "Kakehashi | Home",
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
  // {
  //   title: "My Projects",
  //   href: "/home/my-projects",
  // },
  {
    title: "Find Contributors",
    href: "/home/find-contributors",
  },
]

interface HomeLayoutProps {
  children: React.ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <div className="md:block min-h-screen">
        <div className="flex flex-col min-h-screen bg-custom-gradient">
          <div className="border-b backdrop-blur-sm bg-white/70">
            <div className="flex h-16 items-center px-2">
              <div className="flex items-center font-bold text-xs md:text-2xl py-1 px-0.5 md:px-2">
                <Image
                  src='/kakehashi.png'
                  width={30}
                  height={30}
                  alt="Kakehashi Logo"
                  className="rounded w-4 h-4 md:w-6 md:h-6 mr-0.5"
                />
                akehashi
              </div>
              <MainNav className="mx-2 md:mx-6 flex" items={mainNavItems} />
              <div className="ml-auto flex items-center space-x-1 md:space-x-4 md:mr-2">
                <div className="hidden md:block">
                  <DonateBtn />
                </div>
                <UserNav />
              </div>
            </div>
          </div>
          <div className="">{children}</div>
        </div>
      </div>
    </>
  )
}
