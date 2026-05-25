'use client';

import GroupingMembersTableSkeleton from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/grouping-members-table-skeleton';
import { usePathname } from 'next/navigation';
import type { Group } from '@/lib/types';

// The last path segment of the route maps to a `Group` union value
// (basis | include | exclude | owners). Anything else is treated as "no group"
// so the skeleton falls back to its default "All Members" heading.
const KNOWN_GROUPS: readonly Group[] = ['basis', 'include', 'exclude', 'owners'];
const isGroup = (value: string | undefined): value is Group =>
    value !== undefined && (KNOWN_GROUPS as readonly string[]).includes(value);

const Loading = () => {
    const pathname = usePathname();
    const segment = pathname.split('/').pop()?.replace(/-/g, ' ');
    return <GroupingMembersTableSkeleton group={isGroup(segment) ? segment : undefined} />;
};

export default Loading;
