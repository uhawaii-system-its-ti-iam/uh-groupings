import { getAllGroupings } from '@/lib/fetchers';
import GroupingsTable from '@/components/table/groupings-table/groupings-table';
import { getUser } from '@/lib/access/user.server';
import { setRoles } from '@/lib/access/authorization';

const GroupingsTab = async () => {
    const user = await setRoles(await getUser());
    const { groupingPaths } = await getAllGroupings(user);
    return (
        <div className="container">
            <GroupingsTable groupingPaths={groupingPaths} />
        </div>
    );
};

export default GroupingsTab;
