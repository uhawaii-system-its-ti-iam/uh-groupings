'use client';

import { useRouter } from 'next/navigation';
import ApiErrorModal from '@/components/modal/api-error-modal';

const Page = () => {
    const router = useRouter();

    return (
        <ApiErrorModal
            open={true}
            onClose={() => router.back()}
        />
    );
};

export default Page;
