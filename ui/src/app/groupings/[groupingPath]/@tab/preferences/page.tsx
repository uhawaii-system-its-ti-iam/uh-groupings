import Preference from './preference';

const PreferenceTab = ({ params }: { params: { groupingPath: string } }) => {
    const { groupingPath } = params;
    return <Preference groupingPath={groupingPath} />;
};

export default PreferenceTab;



