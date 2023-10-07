"use client"
import { useSearchParams } from 'next/navigation'
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { toast } from "@/components/ui/use-toast"
import { useState } from 'react'



const createProfileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Display name must be at least 2 characters.",
    })
    .max(30, {
      message: "Display name must not be longer than 30 characters.",
    }),
  email: z
    .string().email({ message: "Your account email must be a valid email address." }),
})

type CreateProfileFormValues = z.infer<typeof createProfileFormSchema>

export function CreateProfileForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // This can come from your database or API.
  const defaultValues: Partial<CreateProfileFormValues> = {
    name: searchParams.get('name') || "",
    email: searchParams.get('email') || ""
  }

  const form = useForm<CreateProfileFormValues>({
    resolver: zodResolver(createProfileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  async function onSubmit(data: CreateProfileFormValues) {
    // console.log(data)
    // console.log(searchParams.get("id"))
    setLoading(true);
    const userData = {
      id: searchParams.get("id"),
      name: data.name,
      email: data.email
    }
    const response = await fetch('/api/createProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const apiData = await response.json()
    setLoading(false);

    if (apiData.status === '500') {
      setError(true);
      console.log('Error creating profile:', apiData.message)
    }
    if (apiData.status === '201') {
      router.push('/home')
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
                This is your display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="neilarmstrong@nasa.gov" {...field} />
              </FormControl>
              <FormDescription>
                This is your prefered email for your account. Notifications will be sent to this email.
                You may edit notification settings in the account settings tab.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant={error ? 'destructive' : 'default'}
          disabled={loading}
        >
          {loading ? (
            <svg aria-hidden="true" className="w-6 h-6 text-gray-400 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          ) : error ? (
            'Error! Click to try again...'
          ) : 'Create Profile'}
        </Button>
      </form>
    </Form>
  )
}
