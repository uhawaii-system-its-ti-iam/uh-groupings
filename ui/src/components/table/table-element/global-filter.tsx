'use client';

import { Input } from '@/components/ui/input';
import { Dispatch, SetStateAction } from 'react';

const GlobalFilter = ({
    filter,
    setFilter,
    onFilterChange
}: {
    filter: string;
    setFilter: Dispatch<SetStateAction<string>>;
    onFilterChange?: (updatedGlobalFilter: string) => void;
}) => {
    return (
        <Input
            placeholder="Filter Groupings..."
            value={filter || ''}
            onChange={(e) => {
                setFilter(e.target.value);
                onFilterChange && onFilterChange(e.target.value);
            }}
        />
    );
};

export default GlobalFilter;
