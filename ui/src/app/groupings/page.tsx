import { ownerGroupings } from '@/lib/fetchers';
import dynamic from 'next/dynamic';
import GroupingsTableSkeleton from '@/components/table/groupings-table-skeleton';

// Require dynamic import for localStorage
const GroupingsTable = dynamic(() => import('@/components/table/groupings-table'), {
    ssr: false,
    loading: () => <GroupingsTableSkeleton />
});

const Groupings = async () => {
    const { groupingPaths } = await ownerGroupings();

    return (
        <div className="bg-white">
            <div className="container">
                <GroupingsTable groupingPaths={groupingPaths} />
            </div>
        </div>
    );
};

export default Groupings;
