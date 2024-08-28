'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import GroupingHeader from '@/app/groupings/[selectedGrouping]/_components/grouping-header';
import ReturnButtons from '@/app/groupings/[selectedGrouping]/_components/return-buttons';
import ExportDropdown from '@/app/groupings/[selectedGrouping]/_components/export-dropdown';
import SideNav from '@/app/groupings/[selectedGrouping]/_components/side-nav';

const SelectedGrouping = ({ params }: { params: { selectedGrouping: string } }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        // Extract tab from URL parameters or fallback to 'all'
        const tab = searchParams.get('tab') || 'all';
        setActiveTab(tab);
    }, [searchParams]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        // Update URL without reloading the page
        router.push(`/uhgroupings/groupings/${params.selectedGrouping}?tab=${tab}`);
    };

    return (
        <div className="container">
            <div className="mt-4">
                <ReturnButtons />
                <ExportDropdown />
            </div>
            <div id="sel">
                <div className="overflow-hidden mb-5 mt-0">
                    <section>
                        <GroupingHeader />
                    </section>
                    <section>
                        <div className="p-0 min-h-px box-border border-b border-l border-r rounded-b">
                            <div className="flex flex-col md:flex-row mx-auto w-full">
                                <div className="sm:w-full md:w-1/6 lg:w-1/12 bg-teal-tint py-4">
                                    <SideNav setActiveTab={handleTabChange} />
                                </div>
                                <div className="lg:w-11/12 md:w-10/12 sm:w-full">
                                    {activeTab === 'basis' && <div id="basis" className="tab-pane fade">Basis Content</div>}
                                    {activeTab === 'include' && <div id="include" className="tab-pane fade">Include Content</div>}
                                    {activeTab === 'exclude' && <div id="exclude" className="tab-pane fade">Exclude Content</div>}
                                    {activeTab === 'owners' && <div id="owners" className="tab-pane fade">Owners Content</div>}
                                    {activeTab === 'sync-destinations' && <div id="sync-destinations" className="tab-pane fade">Sync Destinations Content</div>}
                                    {activeTab === 'preferences' && <div id="preferences" className="tab-pane fade">Preferences Content</div>}
                                    {activeTab === 'actions' && <div id="actions" className="tab-pane fade">Actions Content</div>}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SelectedGrouping;