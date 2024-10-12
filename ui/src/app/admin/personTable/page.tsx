import { managePersonResults } from '@/lib/fetchers';
import ManagePersonTable from '@/app/admin/personTable/_components/managePersonTable';
import { memberAttributeResults } from '@/lib/actions';

const PersonTable = async (searchParams) => {
    const searchUid = searchParams.searchParams.searchUid;
    const groupingsInfo = (await managePersonResults(searchUid)).results;
    const userInfo = (await memberAttributeResults([searchUid])).results[0];
    const props = { groupingsInfo: groupingsInfo, userInfo: userInfo };

    return (
        <>
            <ManagePersonTable {...props} />
        </>
    );
};

export default PersonTable;
