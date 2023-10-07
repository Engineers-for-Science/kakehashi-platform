import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { sql } from "@vercel/postgres";
import { getSessionUser } from "@/lib/firebase-admin";

import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { Pencil2Icon } from "@radix-ui/react-icons"
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/cards/project-card";

export default async function Profile() {
  const profile = {
    name: 'Firstname Lastname',
    email: 'example@gmail.com',
    orcidId: '00000-00000-00000',
    searchable: true,
    tags: ['Education', 'Chemistry', 'Aerospace', 'Education', 'Chemistry', 'Aerospace'],
    projects: [
      {
        id: 'jbsdhsbdj',
        title: 'Example Project',
        description: 'This is an example project for the purpose of developing this ui.',
        tags: ['Space & Science'],
        status: 'active',
        stars: 69
      },
      {
        id: 'jbsdhsbdj',
        title: 'Example Project',
        description: 'This is an example project for the purpose of developing this ui.',
        tags: ['Space & Science'],
        status: 'active',
        stars: 69
      },
      {
        id: 'jbsdhsbdj',
        title: 'Example Project',
        description: 'This is an example project for the purpose of developing this ui.',
        tags: ['Space & Science'],
        status: 'active',
        stars: 69
      },
      {
        id: 'jbsdhsbdj',
        title: 'Example Project',
        description: 'This is an example project for the purpose of developing this ui.',
        tags: ['Space & Science'],
        status: 'active',
        stars: 69
      },
    ]
  }

  const currentSession = await getSessionUser()
  if (!currentSession) {
    return <>Unauthorized</>
  }
  const userId = currentSession.uid
  const user = (await sql`select * from contributor where id = ${userId};`).rows[0]

  return (
    <>
      <div className="p-6">

        <div className="mb-2 text-2xl font-bold flex items-center">
          Profile
          <Link href="/settings" className="ml-2 flex text-sm items-center underline">
            <Pencil2Icon className="mr-1 h-5 w-5" /> Edit
          </Link>
        </div>

        <div className="md:flex md:flex-row">

          <div className="flex-col md:w-1/3 md:pr-4">
            <div className="mb-2 flex flex-row items-center justify-between rounded-lg border p-4 shadow">
              <div className="text-md font-bold">Display Name</div>
              <div className="text-md">{user.name}</div>
            </div>
            <div className="mb-2 flex flex-row items-center justify-between rounded-lg border p-4 shadow">
              <div className="text-md font-bold">Email</div>
              <div className="text-md">{user.email}</div>
            </div>
            <div className="mb-2 flex flex-row items-center justify-between rounded-lg border p-4 shadow">
              <div className="text-md font-bold">ORCID Id</div>
              <div className="text-md">{user.orcid}</div>
            </div>
            <div className="mb-2 flex flex-row items-center justify-between rounded-lg border p-4 shadow">
              <div className="text-md font-bold">Searchable?</div>
              <div className="text-md">
                <Switch
                  checked={profile.searchable}
                  //onCheckedChange={() => { }}
                  disabled
                  aria-readonly
                />
              </div>
            </div>
            <div className="mb-2 flex flex-col items-start justify-start rounded-lg border p-4 shadow">
              <div className="text-md font-bold mb-1">Tags</div>
              <div className="text-md">
                {user.tags[0].split(', ').map((tag: string, index: number) => <Badge key={index} className="mr-1 mb-1">{tag}</Badge>)}
              </div>
            </div>
          </div>

          <div className="mb-2 md:w-2/3 flex flex-col items-start justify-start rounded-lg border p-4 shadow">
            <div className="text-md font-bold mb-1">Projects</div>
            <div className="grid grid-rows-auto grid-cols-1 md:grid-cols-2 gap-2">
              {profile.projects.map(project => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  status={project.status}
                  stars={project.stars}
                />
              ))}
            </div>
          </div>

        </div >

      </div>
    </>
  );
}