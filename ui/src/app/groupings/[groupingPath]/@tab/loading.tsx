'use client';

import GroupingMembersTableSkeleton from '@/components/table/grouping-members-table/grouping-members-table-skeleton';
import { usePathname } from 'next/navigation';

const Loading = () => {
    const pathname = usePathname();
    const group = pathname.split('/').pop()?.replace(/-/g, ' ');
    return <GroupingMembersTableSkeleton group={group} />;
};

export default Loading;
