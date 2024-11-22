import { managePersonResults } from '@/lib/fetchers';
import PersonTable from '@/components/table/person-table/person-table';
import { memberAttributeResults } from '@/lib/actions';
import TestDynamicModal from '@/components/modal/test-dynamic-modal';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import GroupingsTableSkeleton from '@/components/table/groupings-table/groupings-table-skeleton';

const PersonTab = async ({ searchParams }: { uhIdentifier: string }) => {
    const uhIdentifier = searchParams.uhIdentifier;
    const membershipResults = await managePersonResults(uhIdentifier);
    const memberResult =
        uhIdentifier === undefined ? undefined : (await memberAttributeResults([uhIdentifier])).results[0];

    return (
        <>
            <div className="container">
                <PersonTable
                    membershipResults={membershipResults}
                    memberResult={memberResult}
                    uhIdentifier={uhIdentifier}
                />
            </div>
        </>
    );
};

export default PersonTab;
