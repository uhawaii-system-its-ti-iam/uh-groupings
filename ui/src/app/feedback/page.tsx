"use client"
import React from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {sendFeedback} from "@/services/EmailService";
import {EmailResult, Feedback} from "@/services/EmailService";
import {AlertDestructive} from "@/components/layout/modals/DynamicModal";

const Feedback = () => {
  const formSchema = z.object({
    type: z.string(),
    name: z.string(),
    email: z.string().email(),
    message: z.string().min(15),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "General",
      email: "username@email.com",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const input: Feedback = {
      type: values.type,
      name: values.name,
      email: values.email,
      message: values.message,
      exceptionMessage: "test exception message"
    };
    const results = await sendFeedback(input);
    const emailResult: EmailResult = {
      resultCode: results.resultCode,
      recipient: results.recipient,
      from: results.from,
      subject: results.subject,
      text: results.text
    };
    console.log(typeof emailResult.resultCode);
    console.log(emailResult.resultCode);
    if (emailResult.resultCode == "SUCCESS") {
      document.getElementById("successAlert").style.display = 'block';
    } else {
      document.getElementById("failAlert").style.display = 'block';
    }
  }

  return (
    <Form {...form}>
      <>
        <div id="successAlert" style={{display: "block"}} className="container">
          <div className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Info</span>
            <div className="ms-3 text-base">
              <span className="font-bold">Thank you. </span>Your feedback has successfully been submitted.
            </div>
            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-3" aria-label="Close">
              <span className="sr-only">Close</span>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
        </div>
        <div id="failAlert" style={{display: "block"}} className="container">
          <div className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Info</span>
            <div className="ms-3 text-base">
              Email feedback was unsuccessful. <a href="#" className="font-semibold underline hover:no-underline">Click here</a> for more information.
            </div>
            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-2" aria-label="Close">
              <span className="sr-only">Close</span>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="container grid grid-cols-12 pt-5 pb-4">
          <div className="col-span-5 pt-5">
            <h1 className="text-md-left text-3xl font-bold">Feedback</h1>
            <p className="text-md-left text-xl mt-3">Helps us to understand where improvements are needed. Please let us know.</p>
          </div>
          <div className="col-span-7 pl-5 pt-5">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="type" className="text-base">Feedback Type:
                      <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <select id="type" className="w-full px-3 py-1 border border-gray-300 rounded-md focus:accent-blue-500 focus:border-blue-500" {...field}>
                        <option value="General" defaultValue="true">General</option>
                        <option value="Problem">Problem</option>
                        <option value="Feature">Feature</option>
                        <option value="Question">Question</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name" className="text-base">Your Name (Optional):</FormLabel>
                    <FormControl>
                      <Input id="name" className="text-base" placeholder="John Doe" {...field} />
                    </FormControl>
                  <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email" className="text-base">Email Address:
                      <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input id="email" className="text-base" placeholder="Enter your email here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="message" className="text-base">Your Feedback:
                      <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <textarea id="message" className="w-full px-3 py-1 border border-gray-300 rounded-md" rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="text-white bg-uh-button hover:bg-green-blue focus:ring-4 focus:ring-blue-300 rounded-md text-base dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 shadow-2xl" type="submit">Submit</Button>
            </form>
          </div>
        </div>
      </>
    </Form>
  )
}

export default Feedback;
