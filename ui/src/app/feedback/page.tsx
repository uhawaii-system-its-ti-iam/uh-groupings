"use client"
import React from 'react';
import {Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {Label} from "@/components/ui/label";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const FeedbackForm = () => {
  const formSchema = z.object({
    type: z.string(),
    name: z.string(),
    email: z.string().email(),
    feedback: z.string().min(1),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "username@email.com",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <>
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
                    <FormLabel htmlFor="type" className="text-base">Feedback Type:*</FormLabel>
                    <FormControl>
                      <select id="type" className="w-full px-3 py-1 border border-gray-300 rounded-md focus:accent-blue-500 focus:border-blue-500" {...field}>
                        <option value="General" selected>General</option>
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
                    <FormLabel htmlFor="email" className="text-base">Email Address*</FormLabel>
                    <FormControl>
                      <Input id="email" className="text-base" placeholder="Enter your email here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="feedback" className="text-base">Your Feedback*</FormLabel>
                    <FormControl>
                      <textarea id="feedback" className="w-full px-3 py-1 border border-gray-300 rounded-md" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </div>
        </div>
      </>
    </Form>
  )
}

export default FeedbackForm;

const Feedback = () => (
    <>
    <div className="container grid grid-cols-12 pt-5 pb-4">
      <div className="col-span-5 pt-5">
        <h1 className="text-md-left text-3xl font-bold">Feedback</h1>
        <p className="text-md-left text-xl mt-3">Helps us to understand where improvements are needed. Please let us know.</p>
      </div>
      <div className="col-span-7 pl-5 pt-5">
        <div className="pb-3">
          <Label htmlFor="input-type" className="text-base">
            Feedback Type:
            <span className="required-asterisk">*</span>
          </Label>
          <select id="input-type" className="w-full px-3 py-1 border border-gray-300 rounded-md focus:accent-blue-500 focus:border-blue-500">
            <option value="General" selected>General</option>
            <option value="Problem">Problem</option>
            <option value="Feature">Feature</option>
            <option value="Question">Question</option>
          </select>
        </div>
        <div className="pt-5 pb-3">
          <Label htmlFor="name" className="text-base">Your Name (Optional):</Label>
          <Input id="name" placeholder="John Doe"></Input>
        </div>
        <div className="pt-5 pb-3">
          <Label htmlFor="email" className="text-base">Email Address*</Label>
          <Input id="email" placeholder="user@email.com"></Input>
        </div>
        <div className="pt-5 pb-3">
          <Label htmlFor="comments" className="text-base">Your Feedback*</Label>
          <textarea id="comments" className="w-full px-3 py-1 border border-gray-300 rounded-md focus:accent-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div className="pt-5">
          <Button>Submit</Button>
        </div>
      </div>
    </div>
  </>
);

// export default Feedback;
