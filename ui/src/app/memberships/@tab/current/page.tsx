import MembershipsTable from '@/app/memberships/_components/memberships-table';
import { membershipResults } from '@/lib/fetchers';

const CurrentMembershipsTab = async () => {
    const { results } = await membershipResults();
    return (
        <div className="bg-white">
            <div className="container">
                <MembershipsTable memberships={results} isOptOut={true} />
            </div>
        </div>
    );
};

export default CurrentMembershipsTab;
