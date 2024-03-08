'use server';

import { getCurrentUser } from '@/access/AuthenticationService';
import { ApiError } from '@/groupings/GroupingsApiResults';
import { postRequest } from './FetchService';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export type Feedback = {
    name?: string,
    email: string,
    type: string,
    message: string,
    exceptionMessage?: string
};

export type EmailResult = {
    resultCode: string,
    recipient: string,
    from: string,
    subject: string,
    text: string
}

export const sendFeedback = async (feedback: Feedback): Promise<EmailResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/email/send/feedback`;
    return postRequest(endpoint, currentUser.uid, feedback);
}
