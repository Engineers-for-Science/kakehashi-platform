"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"



interface ProfileFormProps extends React.HTMLAttributes<HTMLElement> {
  uid: string,
  userName: string,
  userEmail: string,
  userTags: string[],
  userBio: string,
}

export function ProfileForm({ uid, userName, userEmail, userTags, userBio }: ProfileFormProps) {

  const [tagsState, setTagsState] = useState<string[]>(userTags)

  const profileFormSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(30, {
        message: "Username must not be longer than 30 characters.",
      }),
    email: z
      .string()
      .email()
      .optional(),
    bio: z
      .string()
      .min(0, {
        message: "Bio must be at least 0 characters.",
      })
      .max(255, {
        message: "Bio must not be longer than 255 characters.",
      })
      .optional(),
    tags: z
      .array(
        z.string()
          .min(1, {
            message: "Tags must be at least 1 character.",
          })
          .max(30, {
            message: "Tags must not be longer than 30 characters.",
          }),
      )
      .optional(),
  })

  type ProfileFormValues = z.infer<typeof profileFormSchema>
  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    name: userName,
    email: userEmail,
    bio: userBio,
    tags: tagsState,
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  async function onSubmit(data: ProfileFormValues) {
    const newUserData = {
      ...data,
      email: userEmail,
      tags: data.tags?.join(', '),
      id: uid
    }
    console.log(newUserData)
    setLoading(true);

    const response = await fetch('/api/updateProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUserData),
    });

    const apiData = await response.json()
    setLoading(false);

    if (apiData.status === '500') {
      setError(true);
      console.log('Error creating profile:', apiData.message)
    }
    if (apiData.status === '201') {
      console.log('update successful')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Neil Armstrong" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          disabled
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="neil@nasa.gov" {...field} />
              </FormControl>
              <FormDescription>
                This is the email associated with this account.
                If this is not the correct email, please logout and sign in or
                create an account with the correct email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please describe your strengths and interests with this section.
                This information might be used in the future to optimize your user experience.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          {tagsState.map((tag, index) => (
            <FormField
              control={form.control}
              key={index}
              name={`tags.${index}`}
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
            onClick={() => setTagsState([...tagsState, ""])}
          >
            Add Tag
          </Button>
        </div>

        <Button type="submit" disabled={loading} variant={error ? 'destructive' : 'default'}>
          {loading ? (
            <svg aria-hidden="true" className="w-6 h-6 text-gray-400 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          ) : error ? (
            'Error! Click to try again...'
          ) : 'Update Profile'}
        </Button>

      </form>
    </Form>
  )
}
