"use client"

import { useEffect, useState } from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface SendMailFormProps extends React.HTMLAttributes<HTMLElement> {
  recepientEmail: string,
  senderEmail: string,
}

export function SendMailForm({
  className,
  senderEmail,
  recepientEmail,
  ...props
}: SendMailFormProps) {

  const sendMailFormSchema = z.object({
    senderEmail: z.string(),
    recepientEmail: z.string(),
    message: z
      .string()
      .min(2, {
        message: "Message name must be at least 2 characters.",
      })
      .max(300, {
        message: "Message name must not be longer than 300 characters.",
      }),
  })

  type SendMailFormValues = z.infer<typeof sendMailFormSchema>

  const defaultValues: Partial<SendMailFormValues> = {
    senderEmail: senderEmail,
    recepientEmail: recepientEmail
  }

  const form = useForm<SendMailFormValues>({
    resolver: zodResolver(sendMailFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const [sending, setSending] = useState<boolean>(false);
  const [sendError, setSendError] = useState<boolean>(false);
  const [sendSuccessful, setSendSuccessful] = useState<boolean>(false);
  useEffect(() => {
    if (sendSuccessful) setTimeout(() => setSendSuccessful(false), 3000)
    if (sendError) setTimeout(() => setSendError(false), 3000)
  }, [sendSuccessful, sendError]);

  async function onSubmit(data: SendMailFormValues) {
    setSending(true);
    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    setSending(false);
    if (response.status === 200) {
      console.log('Email successfully sent');
      setSendSuccessful(true);
    } else {
      console.log('Failed to send email');
      setSendError(true);
    }
    toast({
      title: "You submitted the following message:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send a short message:</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`I would love to give you an interview for a position at my company, xyz.\n- Alfred`}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The recepient will be able to see the email listed on your profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="outline"
            size='sm'
            disabled={sending || sendError || sendSuccessful}
            className={`${sending ? 'bg-blue-500' : sendSuccessful ? 'bg-green-500' : sendError ? 'bg-red-500' : ''}`}
          >
            {`${sending ? 'Sending...' : sendSuccessful ? 'Success!' : sendError ? 'Error!' : 'Send'}`}
          </Button>
        </form>
      </Form>
    </>
  )
}