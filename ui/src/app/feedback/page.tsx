"use client"
import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {sendFeedback} from "@/services/EmailService";
import {EmailResult, Feedback} from "@/services/EmailService";
import ErrorAlert from "@/components/layout/alerts/ErrorAlert";
import SuccessAlert from "@/components/layout/alerts/SuccessAlert";

const Feedback = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

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

    (emailResult.resultCode == "SUCCESS") ? setShowSuccessAlert(true) : setShowErrorAlert(true);

    if (emailResult.resultCode == "SUCCESS") {
      setShowSuccessAlert(true);
    } else {
      setShowErrorAlert(true);
    }

    //will break without curly braces
    form.reset({});
  }

  return (
    <Form {...form}>
      <>
        <div id="successAlert" hidden={!showSuccessAlert} className="container">
          <SuccessAlert></SuccessAlert>
        </div>
        <div id="failAlert" hidden={!showErrorAlert} className="container">
          <ErrorAlert></ErrorAlert>
        </div>
        <div className="container grid grid-cols-12 pt-5 pb-4">
          <div className="col-span-5 pt-5">
            <h1 className="text-md-left text-3xl font-bold">Feedback</h1>
            <p className="text-md-left text-xl mt-3">Helps us to understand where improvements are needed. Please let us know.</p>
          </div>
          <div className="col-span-7 pl-5 pt-5">
            <form id="feedbackForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
