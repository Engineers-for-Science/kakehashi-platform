import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id, name, email, tags, bio } = await request.json();
  const result = await sql`
    UPDATE contributor 
    SET 
      Name = ${name},
      Email = ${email},
      Tags = ARRAY[${tags}]::text[],
      Bio = ${bio}
    WHERE ID = ${id};
  `;

  if(!result){
    return NextResponse.json({status: '500', message: `Error creating profile: ${result}`});
  }

  return NextResponse.json({
    status: "201",
    message: "Profile Updated",
    uid: id,
    name: name,
    email: email,
  });
}
