import MembershipsTable from '@/app/memberships/_components/memberships-table';
import { optInGroupingPaths } from '@/lib/fetchers';
import { getUser } from '@/lib/access/user.server';
import { setRoles } from '@/lib/access/authorization';

const MembershipOpportunitiesTab = async () => {
    const user = await setRoles(await getUser());
    const { groupingPaths } = await optInGroupingPaths(user);
    return (
        <div className="bg-white">
            <div className="container">
                <MembershipsTable memberships={groupingPaths} isOptOut={false} />
            </div>
        </div>
    );
};

export default MembershipOpportunitiesTab;
