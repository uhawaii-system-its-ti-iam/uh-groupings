'use client';

import { useState, useEffect } from 'react';
import GroupingBody from '@/app/groupings/[selectedGrouping]/_components/grouping-body';
import ExportDropdown from '@/app/groupings/[selectedGrouping]/_components/export-dropdown';
import ReturnButtons from '@/app/groupings/[selectedGrouping]/_components/return-buttons';
import GroupingHeader from '@/app/groupings/[selectedGrouping]/_components/grouping-header';

const SelectedGrouping = ({ params }: { params: { selectedGrouping: string } }) => {
    const [tabContent, settabContent] = useState(true);

    useEffect(() => {
        const changeStyleAttribute = (id: string, property: string, value: string) => {
            const element = document.getElementById(id);
            if (element) {
                element.style.setProperty(property, value);
            }
        };
        changeStyleAttribute('sel', 'display', 'unset');
    }, []);

    return (
        <div className="container">
            <div className="mt-4">
                <ReturnButtons />
                <ExportDropdown />
            </div>
            <div className={`${tabContent ? 'card-tab-content' : ''}`} id="sel">
                <div className="overflow-hidden mb-5 mt-0">
                    <section>
                        <GroupingHeader />
                    </section>
                    <section>
                        <GroupingBody />
                    </section>
                </div>
            </div>

        </div>
    );
};

export default SelectedGrouping;
