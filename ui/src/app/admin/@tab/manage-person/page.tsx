import { managePersonResults } from '@/lib/fetchers';
import PersonTable from '@/app/admin/_components/person-table/person-table';
import { memberAttributeResults } from '@/lib/actions';
import type { MembershipResults } from '@/lib/types';

const emptyMembershipResults: MembershipResults = {
    resultCode: '',
    results: []
};

const PersonTab = async ({ searchParams }: { searchParams: { uhIdentifier?: string } }) => {
    const uhIdentifier = searchParams.uhIdentifier?.trim() ?? '';
    const membershipResults: MembershipResults = uhIdentifier
        ? JSON.parse(JSON.stringify(await managePersonResults(uhIdentifier)))
        : emptyMembershipResults;
    let memberResult = undefined;
    if (uhIdentifier) {
        const rawMemberResult = (await memberAttributeResults([uhIdentifier])).results[0];
        memberResult = rawMemberResult ? JSON.parse(JSON.stringify(rawMemberResult)) : undefined;
    }
    const showWarning =
        (membershipResults.resultCode === 'FAILURE' && uhIdentifier !== '') ||
        (membershipResults.resultCode === undefined && uhIdentifier !== '') ||
        uhIdentifier === '';

    return (
        <>
            <div className="container">
                <PersonTable
                    membershipResults={membershipResults}
                    memberResult={memberResult}
                    uhIdentifier={uhIdentifier}
                    showWarning={showWarning}
                />
            </div>
        </>
    );
};

export default PersonTab;
