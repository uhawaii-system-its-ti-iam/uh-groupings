import { Users, CreditCard, UserPlus, UserMinus, Crown, Share2, Settings, Wrench } from 'lucide-react';

const SideNav = ({ resetFields, transferMembersFromPageToCheckboxObject, groupingInclude, groupingExclude }) => {
    return (
        <ul className="nav nav-pills flex-md-column flex-row justify-content-md-start justify-content-center" id="group-pills">

            <li className="pr-0 pl-0 mt-1 mx-auto"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.members}
                data-tip="All Members" data-place="right">
                <a data-toggle="tab" href="#all"
                   className="nav-link rounded-circle d-flex align-items-center justify-content-center active"
                   aria-label="All Members" onClick={resetFields}>
                    <Users aria-hidden="true" />
                </a>
            </li>

            <li className="pr-0 pl-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.basis}
                data-tip="Basis Members" data-place="right">
                <a data-toggle="tab" href="#basis"
                   className="nav-link rounded-circle d-flex align-items-center justify-content-center"
                   aria-label="Basis Members" onClick={resetFields}>
                    <CreditCard aria-hidden="true" />
                </a>
            </li>

            <li className="pr-0 pl-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.include}
                data-tip="Include Members" data-place="right">
                <a data-toggle="tab" href="#include"
                   className="nav-link rounded-circle d-flex align-items-center justify-content-center"
                   aria-label="Include Members" onClick={() => {
                    resetFields();
                    transferMembersFromPageToCheckboxObject(groupingInclude);
                }}>
                    <UserPlus aria-hidden="false" />
                </a>
            </li>

            <li className="pr-0 pl-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.exclude}
                data-tip="Exclude Members" data-place="right">
                <a data-toggle="tab" href="#exclude"
                   className="nav-link rounded-circle d-flex align-items-center justify-content-center"
                   aria-label="Exclude Members" onClick={() => {
                    resetFields();
                    transferMembersFromPageToCheckboxObject(groupingExclude);
                }}>
                    <UserMinus aria-hidden="true" />
                </a>
            </li>

            <li className="pr-0 pl-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.owners}
                data-tip="Grouping Owners" data-place="right">
                <a data-toggle="tab" href="#owners"
                   className="nav-link rounded-circle d-flex align-items-center justify-content-center"
                   aria-label="Grouping Owners" onClick={resetFields}>
                    <Crown aria-hidden="true" />
                </a>
            </li>

            <li className="pr-0 pl-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.sync-destinations}
                data-tip="Sync Destinations" data-place="right">
                <a data-toggle="tab" href="#sync-destinations"
                   className="nav-link rounded-circle d-flex align-items-center justify-content-center"
                   aria-label="Sync Destinations">
                    <Share2 aria-hidden="true" />
                </a>
            </li>
            <li className="pr-0 pl-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.preferences}
                data-tip="Preferences" data-place="right">
                <a data-toggle="tab" href="#preferences"
                   className="nav-link rounded-circle d-flex align-items-center justify-content-center"
                   aria-label="Preferences">
                    <Settings aria-hidden="true" />
                </a>
            </li>

            <li className="pr-0 pl-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.actions}
                data-tip="Actions" data-place="right">
                <a data-toggle="tab" href="#actions"
                   className="nav-link rounded-circle d-flex align-items-center justify-content-center"
                   aria-label="Actions">
                    <Wrench aria-hidden="true" />
                </a>
            </li>
        </ul>
    );
}

export default SideNav;
