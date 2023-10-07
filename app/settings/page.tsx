import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./profile-form"
import { getSessionUser } from "@/lib/firebase-admin"
import { sql } from "@vercel/postgres"

export default async function SettingsProfilePage() {
  const currentSession = await getSessionUser()
  if (!currentSession) {
    return <>Unauthorized</>
  }
  const userId = currentSession.uid
  const user = (await sql`select * from contributor where id = ${userId};`).rows[0]
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm
        uid={user.id}
        userName={user.name}
        userEmail={user.email}
        userTags={user.tags[0].split(', ')}
        userBio={user.bio || ""}
      />
    </div>
  )
}
