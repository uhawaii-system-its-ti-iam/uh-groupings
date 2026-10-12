'use client';

import { isAdminContext } from '@/lib/grouping-context';
import { usePathname, useSearchParams } from 'next/navigation';
import Heading from './heading';
import { sectionHeadings } from './section-headings';

const GroupingsHeading = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isGroupingDetail = /^\/groupings\/[^/]+(?:\/|$)/.test(pathname);
    const section = isGroupingDetail && isAdminContext(searchParams.getAll('from')) ? 'admin' : 'groupings';

    return <Heading {...sectionHeadings[section]} />;
};

export default GroupingsHeading;
