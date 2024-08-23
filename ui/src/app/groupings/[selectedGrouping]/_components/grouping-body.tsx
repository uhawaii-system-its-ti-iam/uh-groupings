import { useState } from 'react';
import SideNav from '@/app/groupings/[selectedGrouping]/_components/side-nav';


const GroupingBody = () => {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="p-0 min-h-px box-border border-b border-l border-r rounded-b">
            <div className="flex flex-col md:flex-row mx-auto w-full">
                <div className="sm:w-full md:w-1/6 lg:w-1/12 bg-teal-tint py-4">
                    <SideNav setActiveTab={setActiveTab} />
                </div>
                <div className="lg:w-11/12 md:w-10/12 sm:w-full">
                    {activeTab === 'basis' && <div id="basis" className="tab-pane fade"></div>}
                    {activeTab === 'include' && <div id="include" className="tab-pane fade"></div>}
                    {activeTab === 'exclude' && <div id="exclude" className="tab-pane fade"></div>}
                    {activeTab === 'owners' && <div id="owners" className="tab-pane fade"></div>}

                    {activeTab === 'sync-destinations' && (
                        <div id="sync-destinations" className="tab-pane fade">

                        </div>
                    )}
                    {activeTab === 'preferences' && (
                        <div id="preferences" className="tab-pane fade">

                        </div>
                    )}
                    {activeTab === 'actions' && (
                        <div id="actions" className="tab-pane fade">

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupingBody;
