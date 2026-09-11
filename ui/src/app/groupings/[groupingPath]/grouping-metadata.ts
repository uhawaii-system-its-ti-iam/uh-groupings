import type { Metadata } from 'next';

type GroupingMetadataProps = {
    searchParams?: {
        from?: string | string[];
    };
};

export const generateGroupingMetadata = ({ searchParams }: GroupingMetadataProps): Metadata => {
    const from = searchParams?.from;
    const isAdmin = from === 'admin' || (Array.isArray(from) && from.includes('admin'));
    return {
        title: {
            absolute: isAdmin ? 'UH Groupings Admin' : 'UH Groupings Owners'
        }
    };
};
