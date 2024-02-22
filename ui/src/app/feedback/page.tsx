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
    <div className="container flex">
      <div className="columns-1">
        <h1 className="text-md-left">Feedback</h1>
        <p>Helps us to understand where improvements are needed. Please let us know.</p>
      </div>
      <div className="columns-1">
        <div className="row-auto">
          <Label htmlFor="feedback-type">Feedback Type:*</Label>
          <select id="feedback-type" className="bg-gray-50 border">
            <option selected>Choose a type</option>
            <option value="General">General</option>
            <option value="Problem">Problem</option>
            <option value="Feature">Feature</option>
            <option value="Question">Question</option>
          </select>
        </div>
        <div className="row-auto">
          <Label htmlFor="name">Your Name (Optional):</Label>
          <Input id="name" placeholder="John Doe"></Input>
        </div>
        <div className="row-auto">
          <Label type="email" htmlFor="email">Email Address*</Label>
          <Input id="email" placeholder="user@email.com"></Input>
        </div>
        <div className="row-auto">
          <Label htmlFor="comments">Your Feedback*</Label>
          <Input id="comments"></Input>
        </div>
      </div>
    </div>
  </>
);

export default Feedback;
