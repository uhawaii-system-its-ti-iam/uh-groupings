import Actions from '@/app/groupings/[groupingPath]/@tab/_components/grouping-actions';
import { getDuplicateOwnersData } from './utils';

interface ActionsTabProps {
    params: { groupingPath: string };
}

const ActionsTab = async ({ params }: ActionsTabProps) => {
    const { groupingPath } = params;
    const { duplicateOwners, duplicateOwnersCount } = await getDuplicateOwnersData(groupingPath);

    return (
        <Actions
            groupingPath={groupingPath}
            initialDuplicateOwners={duplicateOwners}
            initialDuplicateOwnersCount={duplicateOwnersCount}
        />
    );
};

export default ActionsTab;
