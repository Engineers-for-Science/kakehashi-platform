"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const projectFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Project name must be at least 2 characters.",
    })
    .max(30, {
      message: "Project name must not be longer than 30 characters.",
    }),
  website: z
    .string().url({ message: "Project website must be a working URL." }),
  repository: z
    .string().url({ message: "Project repository must be a working URL." }).optional(),
  tags: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, {
            message: "Tags must be at least 1 character.",
          })
          .max(12, {
            message: "Tags must not be longer than 12 characters.",
          }),
      })
    )
    .optional(),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProjectFormValues> = {
  tags: [
    { value: "Aerospace" },
  ],
}

export function ProjectForm() {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "tags",
    control: form.control,
  })

  function onSubmit(data: ProjectFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:w-2/3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Space App" {...field} />
              </FormControl>
              <FormDescription>
                This is your projects display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://nasa.gov" {...field} />
              </FormControl>
              <FormDescription>
                This is the website that is associated with your project.
                Your projects listing will be auto-generated with information from this website.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repository"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/nasa" {...field} />
              </FormControl>
              <FormDescription>
                This is the repository that is associated with your project.
                Your projects listing will be auto-generated with information from this repository.
                The repository field is optional. If your project has a repository and no website, please enter the link to the repo in the website field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`tags.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Tags
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Tags are auto-generated for you when you register. You may add tags as you please.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add Tag
          </Button>
        </div> */}
        <Button type="submit">Create Project</Button>
      </form>
    </Form>
  )
}
