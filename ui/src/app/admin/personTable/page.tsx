import { managePersonResults } from '@/lib/fetchers';
import ManagePersonTable from '@/app/admin/personTable/_components/managePersonTable';

const PersonTable = async (searchParams) => {
    const searchUid = searchParams.searchParams.searchUid;
    const data = (await managePersonResults(searchUid)).results;
    console.log(data);

    return (
        <>
            <ManagePersonTable data={data} />
        </>
    );
};

export default PersonTable;
