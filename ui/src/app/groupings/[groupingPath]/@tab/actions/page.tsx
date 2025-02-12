import Actions from './action';

const ActionsTab = ({ params }: { params: { groupingPath: string } }) => {
    const { groupingPath } = params;
    return <Actions groupingPath={groupingPath} />;
};

export default ActionsTab;
