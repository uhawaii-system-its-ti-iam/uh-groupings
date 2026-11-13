import Link from 'next/link';
import type { Metadata } from 'next';
import { message } from '@/lib/messages';

export const metadata: Metadata = {
    title: 'Error'
};

const ErrorPage = () => (
    <section className="container py-8">
        <h1 className="text-[2rem] font-bold mb-4">{message.ApiError.TITLE}</h1>
        {message.ApiError.MODAL_BODY()}
        <div className="flex gap-4 mt-6">
            <Link href="/" className="underline">Return home</Link>
            <Link href={message.ApiError.FEEDBACK_LINK} className="underline">
                {message.ApiError.FEEDBACK_TEXT2}
            </Link>
        </div>
    </section>
);

export default ErrorPage;
