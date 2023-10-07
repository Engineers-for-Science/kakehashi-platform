import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getSessionUser } from "@/lib/firebase-admin";

export async function POST(
  request: Request,
  { params }: { params: { projectid: string } }
) {
  const projectId = params.projectid;
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.error();
  }

  const alreadyFavorited =
    (
      await sql`SELECT count(id) 
      FROM contributor 
      WHERE ${projectId} = ANY(fav_projects);`
    ).rows[0].count !== "0";
  if (alreadyFavorited) {
    await sql`WITH unnested AS (
      SELECT id, unnest(fav_projects) as project
      FROM contributor
      WHERE id = ${user.uid}
    )
    , filtered AS (
        SELECT ARRAY_AGG(project) as filtered_projects
        FROM unnested
        WHERE project != ${projectId}
    )
    UPDATE contributor
    SET fav_projects = (SELECT filtered_projects FROM filtered)
    WHERE id = ${user.uid};`;

    await sql`INSERT INTO favorite (project_id, count)
    VALUES (${projectId}, 1)
    ON CONFLICT (project_id)
    DO UPDATE SET count = favorite.count - 1;`;
  } else {
    await sql`UPDATE contributor 
    SET fav_projects = fav_projects || ARRAY[${projectId}] 
    WHERE id = ${user.uid}`;

    await sql`INSERT INTO favorite (project_id, count)
    VALUES (${projectId}, 1)
    ON CONFLICT (project_id)
    DO UPDATE SET count = favorite.count + 1;`;
  }

  return NextResponse.json({ status: 201, message: "Favorited." });
}
