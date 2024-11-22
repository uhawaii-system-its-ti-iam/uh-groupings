import { ownerGroupings } from '@/lib/fetchers';
import GroupingsTable from '@/components/table/groupings-table/groupings-table';

const GroupingsTab = async () => {
    const { groupingPaths } = await ownerGroupings();
    return (
        <div className="container">
            <GroupingsTable groupingPaths={groupingPaths} />
        </div>
    );
};

export default GroupingsTab;
