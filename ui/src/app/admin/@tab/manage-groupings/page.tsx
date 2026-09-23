import { getAllGroupings } from '@/lib/fetchers';
import GroupingsTable from '@/components/table/groupings-table/groupings-table';
import { getAuthorizedUser } from '@/lib/access/user.server';

const GroupingsTab = async () => {
    const user = await getAuthorizedUser();
    const groupingPathsPage = await getAllGroupings(user, { page: 1, size: 25 });
    return (
        <div className="container">
            <GroupingsTable
                groupingPaths={groupingPathsPage.groupingPaths}
                fromAdmin
                serverPage={{
                    page: groupingPathsPage.page ?? 1,
                    pageSize: groupingPathsPage.pageSize ?? 25,
                    totalCount: groupingPathsPage.totalCount ?? 0
                }}
            />
        </div>
    );
};

export default GroupingsTab;
