import SideNav from '@/app/groupings/[selectedGrouping]/_components/side-nav';
import SyncDestinations from '@/app/groupings/[selectedGrouping]/_components/sync-destinations';
import Preferences from '@/app/groupings/[selectedGrouping]/_components/preferences';
import Actions from '@/app/groupings/[selectedGrouping]/_components/actions';

const GroupingBody = () => (
    <div className="p-0 min-h-px box-border border-b border-l border-r rounded-b">
        <div className="flex flex-col md:flex-row mx-auto w-full">

            {/* Not sure */}
            <div className="sm:w-full md:w-1/6 lg:w-1/12 bg-teal-tint py-4">
                <SideNav />
            </div>

            <div className="lg:w-11/12 md:w-10/12 sm:w-full">
                <div id="basis" className="tab-pane fade"></div>
                <div id="include" className="tab-pane fade"></div>
                <div id="exclude" className="tab-pane fade"></div>
                <div id="owners" className="tab-pane fade"></div>
                <div id="sync-destinations" className="tab-pane fade">
                    <SyncDestinations />
                </div>
                <div id="preferences" className="tab-pane fade invisible">
                    <Preferences />
                </div>
                <div id="actions" className="tab-pane fade invisible">
                    <Actions />
                </div>
            </div>
        </div>
    </div>
);

export default GroupingBody;
