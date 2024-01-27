import { redirect } from 'next/navigation';
import { handleLogout } from '@/access/AuthenticationService';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

/**
 * Next.js route handler to catch the redirect after successfully logging out through CAS.
 * Handles the logout then redirects the user back to the home page.
 */
export const GET = async () => {
    await handleLogout();
    redirect(baseUrl);
}
