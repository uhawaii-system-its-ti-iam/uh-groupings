import MembershipsTable from '@/app/memberships/_components/memberships-table';
import { optInGroupingPaths } from '@/lib/fetchers';
import { getAuthorizedUser } from '@/lib/access/user.server';

const MembershipOpportunitiesTab = async () => {
    const user = await getAuthorizedUser();
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
