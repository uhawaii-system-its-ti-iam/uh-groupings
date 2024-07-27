import SideNav from '@/app/groupings/_components/side-nav';
import Members from '@/app/groupings/_components/members';
import Basis from '@/app/groupings/_components/basis';
import Include from '@/app/groupings/_components/include';
import Exclude from '@/app/groupings/_components/exclude';
import Owners from '@/app/groupings/_components/owners';
import SyncDestinations from '@/app/groupings/_components/sync-destinations';
import Preferences from '@/app/groupings/_components/preferences';
import Actions from '@/app/groupings/_components/actions';

const GroupingBody = () => (
    <div className="card-body p-0 border-bottom border-left border-right rounded-bottom">
        <div className="row mx-auto">
            <div className="col-lg-1 col-md-2 col-12 teal-tint-bg pt-3 pb-3" id="pills-column">
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
