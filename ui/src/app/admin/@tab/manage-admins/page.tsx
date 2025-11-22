import { groupingAdmins } from '@/lib/fetchers';
import AdminTable from '@/app/admin/_components/admin-table/admin-table';

const AdminsTab = async () => {
    const groupingGroupMembers = await groupingAdmins();
    return (
        <div className="container">
            <AdminTable groupingGroupMembers={groupingGroupMembers} />
        </div>
    );
};

export default AdminsTab;
