import { ownerGroupings } from '@/lib/fetchers';
import GroupingsTable from '@/components/table/groupings-table/groupings-table';
import GroupingsTableSkeleton from '@/components/table/groupings-table/groupings-table-skeleton';

const Groupings = async () => {
    const { groupingPaths } = await ownerGroupings();

    return (
        <div className="bg-white">
            <div className="container">
                {/*<GroupingsTable groupingPaths={groupingPaths} />*/}
                <GroupingsTableSkeleton />
            </div>
        </div>
    );
};

export default Groupings;
