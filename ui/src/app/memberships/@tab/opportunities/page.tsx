import MembershipsTable from '@/app/memberships/_components/memberships-table';
import { optInGroupingPaths } from '@/lib/fetchers';

const MembershipOpportunitiesTab = async () => {
    const { groupingPaths } = await optInGroupingPaths();
    return (
        <div className="bg-white">
            <div className="container">
                <MembershipsTable memberships={groupingPaths} isOptOut={false} />
            </div>
        </div>
    );
};

export default MembershipOpportunitiesTab;
