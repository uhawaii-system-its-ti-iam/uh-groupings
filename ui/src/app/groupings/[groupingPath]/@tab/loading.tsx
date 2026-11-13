'use client';

import GroupingMembersTableSkeleton from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/grouping-members-table-skeleton';
import { usePathname } from 'next/navigation';
import type { Group } from '@/lib/types';

const Loading = () => {
    const pathname = usePathname();
    const segment = pathname.split('/').pop();
    const group: Group | undefined = segment === 'basis' || segment === 'include' || segment === 'exclude' || segment === 'owners'
        ? segment
        : undefined;
    return <GroupingMembersTableSkeleton group={group} />;
};

export default Loading;
