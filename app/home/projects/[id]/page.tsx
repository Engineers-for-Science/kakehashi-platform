import { StarProjectBtn } from "@/components/StarProjectBtn";
import { TeamCard } from "@/components/cards/team-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/firebase-admin";
import { StarIcon } from "@radix-ui/react-icons";
import { sql } from "@vercel/postgres";
import Image from "next/image";


export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = {
    id: params.id,
    title: 'Example Project',
    description: 'This is an example project for the purpose of developing this ui.',
    overview: 'There are many different open science and open-source projects and tools, but no efficient way to match project creators with interested collaborators who possess the skills required to contribute. This is a solution that will help people who are looking for open-source projects to work on and project creators who need skilled contributors to find each other and communicate.',
    category: 'Space & Science',
    lastUpdated: 'April 14, 2023',
    stars: 400,
    media: [
      "https://imgs.search.brave.com/HwNbXbrpHqcsLkVoQpSaPxJYkLUxg5nNFzQ8yA5cdow/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtYXNzZXRzLm5h/c2EuZ292L2ltYWdl/L2lzczAyMGUwMjMz/NjIvaXNzMDIwZTAy/MzM2Mn5sYXJnZS5q/cGc_dz0xOTIwJmg9/MTMxNCZmaXQ9Y2xp/cCZjcm9wPWZhY2Vz/LGZvY2FscG9pbnQ",
      "https://imgs.search.brave.com/ogoYTF8xGXdlZ6RNWH1RaUSNJtL1uO_fpG_wq96s50s/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93d3cu/bmFzYS5nb3Yvd3At/Y29udGVudC91cGxv/YWRzLzIwMjAvMDEv/Y2Fzc2FkYS1hdC1j/dXBvbGEuanBnP3c9/NjQw",
      "https://imgs.search.brave.com/Ahe8Ok1Fy4hl2VCGe4dFhfLYAlxOelFa74KxQruZxlY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuc2NpZW50aWZp/Y2FtZXJpY2FuLmNv/bS9zY2lhbS9jYWNo/ZS9maWxlL0YzMzND/RDYzLUVCQjQtNEZC/RS1BNUUyNDQxRDZF/QTNEMzAwX3NvdXJj/ZS5qcGc_dz01OTAm/aD04MDAmMUQ3N0JC/OTQtMjhFMS00QkFB/LThBM0MzQjQxM0JD/RkRCRDc",
    ],
    website: "https://jackjack.dev",
    repository: "https://github.com/Engineers-for-Science/orcid-next-poc",
    team: [
      {
        id: "bsdhbsdksdbk",
        name: "JackJack Dev",
        email: "jackyoukstetter1@gmail.com",
        role: "Developer",
      },
      {
        id: "hsdkjsdhkjsdh",
        name: "Taro Dev",
        email: "taro.ishihara.mail@gmail.com",
        role: "Developer",
      }
    ]
  }

  const result = await sql`
    SELECT * FROM project WHERE project_id = ${params.id};
  `;

  const user = await getSessionUser()
  if (!user) {
    return <>Unauthorized</>
  }
  const isFavorited = (await sql`
    SELECT fav_projects FROM contributor WHERE id = ${user.uid};
  `).rows[0].fav_projects.includes(params.id);
  const favResult = await sql`SELECT count FROM favorite WHERE project_id = ${params.id};`;
  const stars = favResult.rows[0] ? favResult.rows[0].count : 0

  return (
    <>
      <div className="p-6">

        <div className="mb-2 text-2xl font-bold flex items-center justify-between">
          <div className="rounded-lg backdrop-blur-sm bg-white/90 p-4 shadow">{result.rows[0].project_name}</div>
          <StarProjectBtn stars={stars} projectId={result.rows[0].project_id} isFavorited={isFavorited} />
        </div>

        <div className="md:flex md:flex-row">

          <div className="flex-col md:w-2/3 md:pr-4">

            <div className="mb-2 flex flex-col items-start justify-start rounded-lg backdrop-blur-sm bg-white/90 p-4 shadow">
              <div className="text-md font-bold">Description</div>
              <div className="text-md" dangerouslySetInnerHTML={{ __html: result.rows[0].description }}></div>
            </div>

            <div className="mb-2 flex flex-col items-start justify-start rounded-lg backdrop-blur-sm bg-white/90 p-4 shadow">
              <div className="text-md font-bold">Tags</div>
              <div className="flex flex-wrap pt-1">
                {result.rows[0].tags[0].split(', ').map((tag: string, index: number) => <Badge key={index} className="mr-1 mb-1">{tag.slice(1, -1)}</Badge>)}
              </div>
            </div>

            {result.rows[0].project_url ? (
              <div className="mb-2 flex flex-col items-start justify-start rounded-lg backdrop-blur-sm bg-white/90 p-4 shadow">
                <div className="text-md font-bold">Website</div>
                <a href={result.rows[0].project_url} target="_blank" className="text-md underline hover:text-blue-300">{result.rows[0].project_url}</a>
              </div>
            ) : <></>}

            {result.rows[0].github_url ? (
              <div className="mb-2 flex flex-col items-start justify-start rounded-lg backdrop-blur-sm bg-white/90 p-4 shadow">
                <div className="text-md font-bold">Repository</div>
                <a href={result.rows[0].github_url} target="_blank" className="text-md underline hover:text-blue-300 break-all">{result.rows[0].github_url}</a>
              </div>
            ) : <></>}


          </div>

          <div className="md:w-1/3">
            {/* <div className="mb-2 flex flex-col items-start justify-start rounded-lg backdrop-blur-sm bg-white/90 p-4 shadow">
              <div className="text-md font-bold mb-1">Media</div>
              <div className="text-md flex flex-wrap">
                {project.media.map((image, index) => (
                  <img key={index} src={image} alt="project media" className="w-40 mr-1 mb-1 rounded backdrop-blur-sm bg-white/90" />
                ))}
              </div>
            </div> */}
            <TeamCard members={project.team} />
          </div>

        </div >

      </div>
    </>
  )
}