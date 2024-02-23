import React from 'react';
import {Input} from "@/components/ui/input";
// import {
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
import {Label} from "@/components/ui/label";
import {blue} from "next/dist/lib/picocolors";
import {Button} from "@/components/ui/button";


const Feedback = () => (
      // <FormField name="name" render={() => (
      //   <FormItem>
      //     <FormLabel>Username</FormLabel>
      //     <FormControl>
      //       <Input placeholder="shadcn" />
      //     </FormControl>
      //     <FormDescription>
      //       This is your public display name.
      //     </FormDescription>
      //     <FormMessage />
      //   </FormItem>
      // )}></FormField>
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

export default Feedback;
