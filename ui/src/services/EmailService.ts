'use server';

import { getCurrentUser } from '@/access/AuthenticationService';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export type Feedback = {
  name?: string,
  email: string,
  type: string,
  message: string,
  exceptionMessage?: string
}

export type EmailResult = {
  resultCode: string,
  recipient: string,
  from: string,
  subject: string,
  text: string
}

export const sendFeedback = async (feedback: Feedback): Promise<EmailResult> => {
  const currentUser = await getCurrentUser();
  const endpoint = `${baseUrl}/email/send/feedback`
  return axios.post(endpoint, feedback, { headers: { 'current_user': currentUser.uid } })
    .then(response => response.data as EmailResult);
}