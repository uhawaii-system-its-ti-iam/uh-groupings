import SideNav from '@/app/groupings/[selectedGrouping]/_components/side-nav';
import Members from '@/app/groupings/[selectedGrouping]/_components/members';
import Basis from '@/app/groupings/[selectedGrouping]/_components/basis';
import Include from '@/app/groupings/[selectedGrouping]/_components/include';
import Exclude from '@/app/groupings/[selectedGrouping]/_components/exclude';
import Owners from '@/app/groupings/[selectedGrouping]/_components/owners';
import SyncDestinations from '@/app/groupings/[selectedGrouping]/_components/sync-destinations';
import Preferences from '@/app/groupings/[selectedGrouping]/_components/preferences';
import Actions from '@/app/groupings/[selectedGrouping]/_components/actions';

const GroupingBody = () => (
    <div className="card-body p-0 border-b border-l border-r rounded-b-l">
        <div className="flex flex-row mx-auto">

            <div className="w-full sm:w-1/6 md:w-1/6 lg:w-1/12 bg-teal-tint pt-3 pb-3" id="pills-column">
                <SideNav />
            </div>


            <div className="tab-content col-lg-11 col-md-10 col-12" id="pill-content">
                <Members />
                <div id="basis" className="tab-pane fade">
                    <Basis />
                </div>
                <div id="include" className="tab-pane fade">
                    <Include />
                </div>
                <div id="exclude" className="tab-pane fade">
                    <Exclude />
                </div>
                <div id="owners" className="tab-pane fade">
                    <Owners />
                </div>
                <div id="sync-destinations" className="tab-pane fade">
                    <SyncDestinations />
                </div>
                <div id="preferences" className="tab-pane fade">
                    <Preferences />
                </div>
                <div id="actions" className="tab-pane fade">
                    <Actions />
                </div>
            </div>
        </div>
    </div>
);

export default GroupingBody;
