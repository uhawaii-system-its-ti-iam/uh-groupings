import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useQueryString = () => {
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (...entries: Array<[string, string]>) => {
            const params = new URLSearchParams(searchParams.toString());
            entries.forEach(([name, value]) => {
                params.set(name, value);
                if (value === '') {
                    params.delete(name);
                }
            });

            return params.toString();
        },
        [searchParams]
    );

    return { searchParams, createQueryString };
};
