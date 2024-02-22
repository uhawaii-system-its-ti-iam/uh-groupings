'use server';

import { getCurrentUser } from '@/access/authentication';
import { postRequest } from './http-client';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export type Feedback = {
    name?: string;
    email: string;
    type: string;
    message: string;
    exceptionMessage?: string;
};

export type EmailResult = {
    resultCode: string;
    recipient: string;
    from: string;
    subject: string;
    text: string;
};

/**
 * Sends feedback to Groupings API to send email.
 *
 * @param feedback - the feedback
 *
 * @returns The EmailResult
 */
export const sendFeedback = async (feedback: Feedback): Promise<EmailResult> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/email/send/feedback`;
    return postRequest<EmailResult>(endpoint, currentUser.uid, feedback);
};

/**
 * Sends feedback to Groupings API to send stack trace email.
 *
 * @param stackTrace - the stack trace
 *
 * @returns The EmailResult
 */
export const sendStackTrace = async (stackTrace: string): Promise<EmailResult> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/email/send/stack-trace`;
    return postRequest<EmailResult>(endpoint, currentUser.uid, stackTrace, 'text/plain');
};
