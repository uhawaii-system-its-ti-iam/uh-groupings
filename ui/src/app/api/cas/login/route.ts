import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { handleLogin } from '@/access/AuthenticationService';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

/**
 * Next.js route handler to catch the redirect after successfully logging in through CAS.
 * Handles the login then redirects the user back to the home page.
 * 
 * @param req - The request object
 */
export const GET = async (req: NextRequest) => {
    const ticket = req.nextUrl.searchParams.get('ticket') as string;
    await handleLogin(ticket);
    redirect(baseUrl);
}
