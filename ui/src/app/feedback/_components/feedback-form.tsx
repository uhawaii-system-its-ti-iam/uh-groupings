'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { sendFeedback } from '@/lib/actions';
import User from '@/lib/access/user';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import ErrorAlert from './error-alert';
import SuccessAlert from './success-alert';

const maxLength = parseInt(process.env.NEXT_PUBLIC_FEEDBACK_FORM_MAX_LENGTH as string);

export const feedbackFormSchema = z.object({
    type: z.string(),
    name: z.optional(z.string()),
    email: z.string().email(),
    message: z
        .string()
        .min(15, 'Feedback must be at least 15 characters')
        .max(500, 'Feedback must be 500 characters or less')
});

const FeedbackForm = ({ currentUser }: { currentUser: User }) => {
    const [showSuccessAlert, isShowSuccessAlert] = useState(false);
    const [showErrorAlert, isShowErrorAlert] = useState(false);

    const form = useForm<z.infer<typeof feedbackFormSchema>>({
        resolver: zodResolver(feedbackFormSchema),
        mode: 'onChange',
        defaultValues: {
            type: 'General',
            email: `${currentUser.uid}@hawaii.edu`,
            message: ''
        }
    });

    const message = form.watch('message', '');

    const onSubmit = async (values: z.infer<typeof feedbackFormSchema>) => {
        isShowSuccessAlert(false);
        isShowErrorAlert(false);

        const emailResult = await sendFeedback(values);

        if (emailResult.resultCode !== 'SUCCESS') {
            isShowErrorAlert(true);
            return;
        }

        isShowSuccessAlert(true);
        form.reset({});
    };

    return (
        <Form {...form}>
            <div className="col-span-7 pl-5 pt-5">
                {showSuccessAlert && <SuccessAlert />}
                {showErrorAlert && <ErrorAlert />}
                <form id="feedbackForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="type" className="text-base">
                                    Feedback Type:
                                    <span className="text-red-500"> *</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue="General">
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="General" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="General">General</SelectItem>
                                        <SelectItem value="Problem">Problem</SelectItem>
                                        <SelectItem value="Feature">Feature</SelectItem>
                                        <SelectItem value="Question">Question</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name" className="text-base">
                                    Your Name (Optional):
                                </FormLabel>
                                <FormControl>
                                    <Input id="name" placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage className="text-base" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="email" className="text-base">
                                    Email Address:
                                    <span className="text-red-500"> *</span>
                                </FormLabel>
                                <FormControl>
                                    <Input id="email" placeholder="Enter your email here" {...field} />
                                </FormControl>
                                <FormMessage className="text-base" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="message" className="text-base">
                                    Your Feedback:
                                    <span className="text-red-500"> *</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea id="message" rows={6} {...field} />
                                </FormControl>
                                <p
                                    className={`text-sm ${
                                        message.length === 0
                                            ? 'text-gray-500'
                                            : message.length > maxLength || message.length < 15
                                              ? 'text-red-500'
                                              : 'text-gray-500'
                                    }`}
                                >
                                    {message.length}/{maxLength} characters
                                </p>
                                {form.formState.errors.message && (
                                    <p className="text-red-500 text-base">{form.formState.errors.message?.message}</p>
                                )}
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={!form.formState.isValid}>
                        Submit
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default FeedbackForm;
