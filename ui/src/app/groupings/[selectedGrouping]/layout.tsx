'use client';

import ReturnButtons from '@/app/groupings/[selectedGrouping]/_components/return-buttons';
import ExportDropdown from '@/app/groupings/[selectedGrouping]/_components/export-dropdown';
const SelectedGroupingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <div className="container">
                <div className="mt-4">
                    <ReturnButtons />
                    <ExportDropdown />
                </div>
                {children}
            </div>
        </main>
    );
};

export default SelectedGroupingLayout;
