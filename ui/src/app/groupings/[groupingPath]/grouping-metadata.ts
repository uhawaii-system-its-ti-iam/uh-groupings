import { isAdminContext } from '@/lib/grouping-context';
import type { Metadata } from 'next';

type GroupingMetadataProps = {
    searchParams: Promise<{
        from?: string | string[];
    }>;
};

export const generateGroupingMetadata = async ({ searchParams }: GroupingMetadataProps): Promise<Metadata> => {
    const { from } = await searchParams;
    const isAdmin = isAdminContext(from);
    return {
        title: {
            absolute: isAdmin ? 'UH Groupings Admin' : 'UH Groupings Owners'
        }
    };
};
