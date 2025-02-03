'use client';

import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Dispatch, SetStateAction } from 'react';

const GlobalFilter = ({
    placeholder,
    filter,
    setFilter,
    onFilterChange,
    isLoading
}: {
    placeholder: string;
    filter: string;
    setFilter: Dispatch<SetStateAction<string>>;
    onFilterChange?: () => void;
    isLoading?: boolean;
}) => {
    return (
        <div className="relative w-full">
            <Input
                placeholder={placeholder}
                value={filter || ''}
                onChange={(e) => {
                    setFilter(e.target.value);
                    onFilterChange?.();
                }}
            />
            {isLoading && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                    <Spinner size="sm" />
                </div>
            )}
        </div>
    );
};

export default GlobalFilter;
