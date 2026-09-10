import { getAllGroupings } from '@/lib/fetchers';
import GroupingsTable from '@/components/table/groupings-table/groupings-table';

const GroupingsTab = async () => {
    const { groupingPaths } = await getAllGroupings();
    return (
        <div className="container">
            <GroupingsTable groupingPaths={groupingPaths} />
        </div>
    );
};

export default GroupingsTab;
