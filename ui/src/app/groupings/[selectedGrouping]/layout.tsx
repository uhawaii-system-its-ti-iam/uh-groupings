import ExportDropdown from './_components/export-dropdown';
import GroupingHeader from './_components/grouping-header';
import ReturnButtons from './_components/return-buttons';
import SideNav from './_components/side-nav';

const SelectedGroupingLayout = ({ params, tab }: { params: { selectedGrouping: string }; tab: React.ReactNode }) => {
    return (
        <div className="container">
            <div className="mt-4">
                <ReturnButtons />
                <ExportDropdown />
            </div>
            <GroupingHeader />
            <div className="flex">
                <SideNav selectedGrouping={params.selectedGrouping} />
                {tab}
            </div>
        </div>
    );
};

export default SelectedGroupingLayout;
