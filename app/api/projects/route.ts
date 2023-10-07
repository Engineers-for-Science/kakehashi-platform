import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

import {
  createVectorFromTags,
  extractTagsFromProjectURL,
} from "@/lib/dataModifiers";
import { v4 } from "uuid";
import { deleteProjectsFromPinecone } from "@/lib/pinecone";

// export async function POST(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const url = searchParams.get("url")!;
//   const tags = await extractTagsFromProjectURL(url);
//   console.log(tags);
//   const uid = v4();
//   await createVectorFromTags(uid, tags, "project");

//   return NextResponse.json({
//     status: "201",
//     message: "Project created.",
//     id: uid,
//   });
// }

export async function PUT(request: Request) {
  const body = await request.json();

  // console.log(body["_project"].length);
  // const project = body["_project"][71];
  // const description = project["project_description"];
  // const url = project["project_url_external"];
  // const email = project["email"];
  // const start_date = new Date(project["start_date"]);
  // const status = project["project_status"];
  // const tags = await extractTagsFromProjectURL(url, description);
  // console.log(tags);
  // const uid = v4();
  // await createVectorFromTags(uid, tags, "project");
  // const serializedTag = tags.map((tag) => `'${tag}'`).join(", ");

  //   CREATE TABLE Project (
  //     project_id VARCHAR(255) PRIMARY KEY,
  //     project_name VARCHAR(255) NOT NULL,
  //     start_date DATE,
  //     end_date DATE,
  //     description TEXT,
  //     status VARCHAR(50),
  //     tags TEXT[],
  //     project_owner VARCHAR(255),
  //     project_member_01 VARCHAR(255),
  //     project_member_02 VARCHAR(255),
  //     project_member_03 VARCHAR(255),
  //     project_member_04 VARCHAR(255),
  //     project_member_05 VARCHAR(255),
  //     project_url VARCHAR(255),
  //     github_url VARCHAR(255)
  //   );
  const promises = body.map((project: any) => {
    const serializedTags = project.tags
      .map((tag: string) => `'${tag}'`)
      .join(", ");
    return sql`INSERT INTO project (project_id, project_name, start_date, end_date, description, status, tags, project_owner, \
        project_member_01, project_member_02, project_member_03, project_member_04, project_member_05, project_url, github_url) \
        VALUES (${project.project_id}, ${project.project_name}, NULL, NULL, ${project.description}, \
        ${project.status}, ARRAY[${serializedTags}], 'exHTumm0URcUNeD1jLKokitpnO23', 'Dt9apdg6OOcWlWF1O0OCsZfc7RJ3', ${project.project_member_02}, \
        '', '', '', ${project.project_url}, ${project.github_url});`;
    // I gave up datetime conversion for now.
  });
  await Promise.all(promises);
  return NextResponse.json({
    status: "201",
    message: "Project created.",
  });

  // for (const project of body["projects"]) {
  //   const description = project["project_description"];
  //   const url = project["project_url_external"];
  //   const email = project["email"];
  //   const start_date = new Date(project["start_date"]);
  //   const status = project["project_status"];
  //   const tags = await extractTagsFromProjectURL(url);
  //   const uid = v4();
  //   await createVectorFromTags(uid, tags, "project");
  //   const serializedTag = tags.map((tag) => `'${tag}'`).join(", ");

  //   const postgreSQLPromise = sql`INSERT INTO projects (id, description, url, email, startDate, tags, status) \
  //     VALUES (${uid}, ${description}, ${url}, ${email}, ${start_date.toDateString()}, ARRAY[${serializedTag}], ${status});`;

  //   await postgreSQLPromise;

  //   return NextResponse.json({
  //     status: "201",
  //     message: "Project created.",
  //   });
  // }
}

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const url = searchParams.get("category")!;
//   const tags = await extractTagsFromProjectURL(url);
//   console.log(tags);
//   const uid = v4();
//   await createVectorFromTags(uid, tags, "project");

//   return NextResponse.json({
//     status: "201",
//     message: "Project created.",
//     id: uid,
//   });
// }

// export function isValidBody(body: JSON) {
//   var isValid = false;
//   return body.hasOwnProperty("projects");
// }

// export function isValidInnerBody(innerBody: JSON) {
//   console.log(innerBody);

//   var isvalid = false;
//   var i = 0;
//   for (var project in innerBody) {
//     console.log("PROJECT:");
//     console.log(project);
//     i++;
//     if (i == 2) {
//       break;
//     }
//   }
//   return false;
//   // return (
//   //   innerBody.hasOwnProperty("project_name") &&
//   //   innerBody.hasOwnProperty("project_url_external") &&
//   //   innerBody.hasOwnProperty("project_description") &&
//   //   innerBody.hasOwnProperty("email") &&
//   //   innerBody.hasOwnProperty("start_date") &&
//   //   innerBody.hasOwnProperty("project_status")
//   // );
// }
