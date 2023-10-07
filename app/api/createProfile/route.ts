import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id, name, email } = await request.json();
  const result = await sql`
    UPDATE contributor 
    SET 
      Name = ${name},
      Email = ${email},
      Email_verified = TRUE
    WHERE ID = ${id};
  `;

  if(!result){
    return NextResponse.json({status: '500', message: `Error creating profile: ${result}`});
  }

  return NextResponse.json({
    status: "201",
    message: "Profile Created",
    uid: id,
    needUpdateProfile: false,
    name: name,
    email: email,
  });
}
