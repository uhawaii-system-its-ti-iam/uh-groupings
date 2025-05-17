import { managePersonResults } from '@/lib/fetchers';
import PersonTable from '@/app/admin/_components/person-table/person-table';
import { memberAttributeResults } from '@/lib/actions';

const PersonTab = async ({ searchParams }: { uhIdentifier: string }) => {
    const uhIdentifier = searchParams.uhIdentifier;
    const membershipResults = await managePersonResults(uhIdentifier);
    const memberResult =
        uhIdentifier === undefined ? undefined : (await memberAttributeResults([uhIdentifier])).results[0];
    const showWarning =
        (membershipResults.resultCode === 'FAILURE' && uhIdentifier !== undefined) ||
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
