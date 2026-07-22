import type { Metadata } from 'next';

type GroupingMetadataProps = {
    searchParams?: {
        from?: string | string[];
    };
};

export const generateGroupingMetadata = ({ searchParams }: GroupingMetadataProps): Metadata => ({
    title: {
        absolute: searchParams?.from === 'admin' ? 'UH Groupings Admin' : 'UH Groupings Owners'
    }
});
