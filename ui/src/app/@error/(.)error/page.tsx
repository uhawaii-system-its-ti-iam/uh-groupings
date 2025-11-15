'use client';

import { useRouter } from 'next/navigation';
import { message } from '@/lib/messages';
import DynamicModal from '@/components/modal/dynamic-modal';
import Link from 'next/link';

const Page = () => {
    const router = useRouter();

    return (
        <DynamicModal
            open={true}
            title={message.ApiError.TITLE}
            body={message.ApiError.MODAL_BODY()}
            buttons={[
                <span key="ok" onClick={() => router.back()}>{message.ApiError.CLOSE_TEXT}</span>,
                <Link key="feedback" href={message.ApiError.FEEDBACK_LINK}>{message.ApiError.FEEDBACK_TEXT2}</Link>,
            ]}
            onClose={() => router.back()}
        />
    );
};

export default Page;
