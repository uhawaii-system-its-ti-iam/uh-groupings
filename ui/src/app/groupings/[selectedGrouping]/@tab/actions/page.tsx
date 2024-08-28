const ActionsTab = ({ params }: { params: { selectedGrouping: string } }) => {
    return (
        <>
            <h1>Grouping Actions</h1>
            <p>{params.selectedGrouping}</p>;
        </>
    );
};

export default ActionsTab;
