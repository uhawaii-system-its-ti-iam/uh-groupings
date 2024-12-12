import { managePersonResults } from '@/lib/fetchers';
import PersonTable from '@/app/admin/_components/personTable';
import { memberAttributeResults } from '@/lib/actions';

const PersonTab = async (searchParams) => {
    const searchUid = searchParams.searchParams.searchUid;
    const groupingsInfo = await managePersonResults(searchUid);
    const userInfo = searchUid === undefined ? undefined : (await memberAttributeResults([searchUid])).results[0];
    const props = { groupingsInfo: groupingsInfo, userInfo: userInfo, searchUid: searchUid };

    return (
        <>
            <div className="container">
                <PersonTable {...props} />
            </div>
        </>
    );
};

export default PersonTab;
