import { createSessionCookie, getUserFromIdToken } from "@/lib/firebase-admin";
import { sql } from "@vercel/postgres";
import {
  createVectorFromTags,
  extractTagsFromORCID,
} from "@/lib/dataModifiers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization") || "";
  const idToken = authHeader.startsWith("Bearer ")
    ? authHeader.split("Bearer ")[1]
    : "";
  // Session Create
  await createSessionCookie(idToken);
  const user = await getUserFromIdToken(idToken);

  // ORCID from token
  const orcid = user.firebase.identities["oidc.orcid"][0];

  // User existence check
  const result =
    await sql`SELECT EXISTS(SELECT 1 FROM contributor WHERE id=${user.uid});`;

  // update user profile
  let needUpdateProfile = false;
  let nameFromProvider = "";
  let emailFromProvider = "";

  if (!result.rows[0].exists) {
    // When user doesn't exist
    const { tags, email } = await extractTagsFromORCID(orcid);
    const emailVerfied = email != "";
    const pineconePromise = createVectorFromTags(user.uid, tags, "contributor");
    const serializedTag = tags.map((tag) => `'${tag}'`).join(", ");
    const postgreSQLPromise = sql`INSERT INTO contributor (id, orcid, name, email, email_verified, tags) VALUES (${user.uid}, ${orcid}, ${user.name}, ${email}, ${emailVerfied}, ARRAY[${serializedTag}]);`;
    await Promise.all([postgreSQLPromise, pineconePromise]);

    needUpdateProfile = true;
    nameFromProvider = user.name;
    emailFromProvider = email;
  }

  return NextResponse.json({
    status: "201",
    message: "Session created.",
    userId: user.uid,
    needUpdateProfile: needUpdateProfile,
    nameFromProvider: nameFromProvider,
    emailFromProvider: emailFromProvider,
  });
}
