import { ProjectCard } from "@/components/cards/project-card";
import { sql } from "@vercel/postgres";
import { getYourMatchedProjects, getProjectsByPresetKeyword } from "@/lib/vectorSearch";
import { getSessionUser } from "@/lib/firebase-admin";

const getProjects = async (category: string) => {
  switch (category) {
    case 'matched':
      const user = await getSessionUser()
      if (!user) {
        return []
      }
      return getYourMatchedProjects(user.uid, 12);
    case 'popular':
      return [];
    case 'new':
      return (await sql`SELECT * FROM project ORDER BY start_date DESC LIMIT 12;`).rows;
    case 'aerospace':
      return getProjectsByPresetKeyword('Aerospace', 12);
    case 'ai':
      return getProjectsByPresetKeyword('AI and Machine Learning', 12);
    case 'chemistry':
      return getProjectsByPresetKeyword('Chemistry', 12);
    case 'biotech':
      return getProjectsByPresetKeyword('Biotech', 12);

    case 'environmental':
      return getProjectsByPresetKeyword('Environment', 12)
    default:
      return [];
  }
}

export default async function ProjectPage({ params }: { params: { category: string } }) {
  const category = params.category;
  const projects = await getProjects(category)

  return (
    <>
      <div className="p-6">
        <div className="text-2xl font-bold mb-4">{params.category.charAt(0).toUpperCase() + params.category.slice(1)} Projects</div>
        <div className="grid grid-rows-auto grid-cols-1 md:grid-cols-3 gap-2">
          {projects.map(project => (
            <ProjectCard
              key={project.project_id}
              id={project.project_id}
              title={project.project_name}
              description={project.description}
              tags={project.tags[0].split(', ')}
              status={project.status}
              stars={0}
            />
          ))}
        </div>
      </div>
    </>
  );
}