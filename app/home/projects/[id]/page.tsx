import { StarProjectBtn } from "@/components/StarProjectBtn";
import { TeamCard } from "@/components/cards/team-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/firebase-admin";
import { StarIcon } from "@radix-ui/react-icons";
import { sql } from "@vercel/postgres";
import Image from "next/image";

function trimApostrophes(str: string) {
  if (str.startsWith("'") && str.endsWith("'")) {
    return str.slice(1, -1);
  }
  return str;
}


export default async function ProjectPage({ params }: { params: { id: string } }) {
  const result = await sql`
    SELECT * FROM project WHERE project_id = ${params.id};
  `;

  const teamMembers = []
  const ownerAwait = sql`
  SELECT * FROM contributor WHERE id = ${result.rows[0].project_owner};
  `;

  const memberIds = [result.rows[0].project_member_01, result.rows[0].project_member_02, result.rows[0].project_member_03, result.rows[0].project_member_04, result.rows[0].project_member_05]
  const validMemberIds = memberIds.filter((id) => id != null && id != '')
  // @ts-expect-error
  const membersAwait = sql`SELECT * FROM contributor WHERE id = any (${validMemberIds});`;

  const [owner, members] = await Promise.all([ownerAwait, membersAwait])
  teamMembers.push({
    id: owner.rows[0].id,
    name: owner.rows[0].name,
    email: owner.rows[0].email,
    tags: owner.rows[0].tags
  })
  members.rows.map(member => {
    teamMembers.push({
      id: member.id,
      name: member.name,
      email: member.email,
      tags: member.tags
    })
  })

  const user = await getSessionUser()
  if (!user) {
    return (
      <>
        <div className="p-6">

          <div className="mb-2 text-2xl font-bold flex items-center justify-between">
            <div className="rounded-lg backdrop-blur-sm bg-white/90 p-4 shadow mr-4">{result.rows[0].project_name}</div>
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
                  {result.rows[0].tags[0].split(', ').map((tag: string, index: number) => <Badge key={index} className="mr-1 mb-1">{trimApostrophes(tag)}</Badge>)}
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
              <TeamCard members={teamMembers} />
            </div>

          </div >

        </div>
      </>
    )
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
          <div className="rounded-lg backdrop-blur-sm bg-white/90 p-4 shadow mr-4">{result.rows[0].project_name}</div>
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
                {result.rows[0].tags[0].split(', ').map((tag: string, index: number) => <Badge key={index} className="mr-1 mb-1">{trimApostrophes(tag)}</Badge>)}
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
            <TeamCard members={teamMembers} />
          </div>

        </div >

      </div>
    </>
  )
}