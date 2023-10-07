import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ProjectForm } from "./project-form";
import { Separator } from "@/components/ui/separator"


export default function Profile() {

  return (
    <>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium">Create a Project</h3>
          <p className="text-sm text-muted-foreground">
            Generate a project listing on the Kakehashi platform.
            Everything will be auto-generated based off of the name and the website/repository links.
          </p>
        </div>
        <Separator />
        <ProjectForm />
      </div>
    </>
  );
}