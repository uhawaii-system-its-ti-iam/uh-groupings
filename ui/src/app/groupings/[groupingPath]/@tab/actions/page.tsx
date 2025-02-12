import Actions from './action';

const ActionsTab = async ({ params }: { params: { groupingPath: string } }) => {
    const { groupingPath } = params;
    return <Actions groupingPath={groupingPath} />;
};

export default ActionsTab;