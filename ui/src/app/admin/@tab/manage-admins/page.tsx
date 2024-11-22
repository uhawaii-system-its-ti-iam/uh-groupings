import { groupingAdmins } from '@/lib/fetchers';
import AdminTable from '@/components/table/admin-table/admin-table';

const AdminsTab = async () => {
    const { members } = await groupingAdmins();
    return (
        <div className="container">
            <AdminTable members={members} />
        </div>
    );
};

export default AdminsTab;
