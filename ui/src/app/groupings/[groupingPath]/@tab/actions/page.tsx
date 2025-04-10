import Actions from '@/app/groupings/[groupingPath]/@tab/_components/grouping-actions';

const ActionsTab = ({ params }: { params: { groupingPath: string } }) => {
    const { groupingPath } = params;
    return <Actions groupingPath={groupingPath} />;
};

export default ActionsTab;
