import Preference from '@/app/groupings/[groupingPath]/@tab/_components/preference';
import { groupingOptAttributes } from '@/lib/fetchers';

const PreferenceTab = async ({ params }: { params: { groupingPath: string } }) => {
    const { groupingPath } = params;
    const decodedGroupingPath = decodeURIComponent(groupingPath);

    const result = await groupingOptAttributes(decodedGroupingPath);

    return (
        <Preference
            groupingPath={groupingPath}
            allowOptIn={result.optInOn}
            allowOptOut={result.optOutOn}
        />
    );
};

export default PreferenceTab;
