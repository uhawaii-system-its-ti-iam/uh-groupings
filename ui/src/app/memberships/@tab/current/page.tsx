import MembershipsTable from '@/app/memberships/_components/memberships-table';
import { membershipResults } from '@/lib/fetchers';
import { getAuthorizedUser } from '@/lib/access/user.server';

const CurrentMembershipsTab = async () => {
    const user = await getAuthorizedUser();
    const { results } = await membershipResults(user);
    return (
        <div className="bg-white">
            <div className="container">
                <MembershipsTable memberships={results} isOptOut={true} />
            </div>
        </div>
    );
};

export default CurrentMembershipsTab;
