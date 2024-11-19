'use client';

import ApiErrorModal from '@/components/modal/api-error-modal';

const GlobalError = ({ error, reset }: { error: Error; reset: () => void }) => {
    return <ApiErrorModal open={true} onClose={reset} error={error} />;
};

export default GlobalError;
