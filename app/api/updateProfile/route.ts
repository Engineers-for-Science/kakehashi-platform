import { createVectorFromTags } from "@/lib/dataModifiers";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id, name, email, tags, bio } = await request.json();
  const promise1 = createVectorFromTags(id, tags, "contributor");
  const promise2 = sql`
    UPDATE contributor 
    SET 
      Name = ${name},
      Email = ${email},
      Tags = ARRAY[${tags}]::VARCHAR(255)[],
      Bio = ${bio}
    WHERE ID = ${id};
  `;

  const [result1, result2] = await Promise.all([promise1, promise2]);

  if (!result2) {
    return NextResponse.json({
      status: "500",
      message: `Error creating profile: ${result2}`,
    });
  }

  return NextResponse.json({
    status: "201",
    message: "Profile Updated",
    uid: id,
    name: name,
    email: email,
  });
}
