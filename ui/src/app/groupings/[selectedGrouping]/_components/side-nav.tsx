import { Users, CreditCard, UserPlus, UserMinus, Crown, Share2, Settings, Wrench } from 'lucide-react';
import { useState } from 'react';

const SideNav = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
    const [groupingExclude, setgroupingExclude] = useState('');
    const [groupingInclude, setgroupingInclude] = useState('');
    const resetFields = () => {};
    const transferMembersFromPageToCheckboxObject = (group: string) => {};

    return (
        <ul className="flex md:flex-col sm:flex-row md:justify-start justify-center">
            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.members}
                data-tip="All Members"
                data-place="right">

                <a data-toggle="tab"
                    href="#all"
                    className="py-2 px-4 items-center justify-center"
                    aria-label="All Members"
                    onClick={() => setActiveTab('all')}>
                    <Users aria-hidden="true" />
                </a>

            </li>
            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.basis}
                data-tip="Basis Members"
                data-place="right">

                <a data-toggle="tab"
                   href="#basis"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Basis Members"
                   onClick={() => setActiveTab('basis')}>
                    <CreditCard aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.include}
                data-tip="Include Members"
                data-place="right">

                <a data-toggle="tab"
                   href="#include"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Include Members"
                   onClick={() => {
                       resetFields();
                       transferMembersFromPageToCheckboxObject('include');
                       setActiveTab('include');
                    }}>
                    <UserPlus aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.exclude}
                data-tip="Exclude Members"
                data-place="right">

                <a data-toggle="tab"
                   href="#exclude"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Exclude Members"
                   onClick={() => {
                       resetFields();
                       transferMembersFromPageToCheckboxObject('exclude');
                       setActiveTab('exclude');
                    }}>
                    <UserMinus aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.owners}
                data-tip="Grouping Owners"
                data-place="right">

                <a data-toggle="tab"
                   href="#owners"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Grouping Owners"
                   onClick={() => setActiveTab('owners')}>
                    <Crown aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.sync-destinations}
                data-tip="Sync Destinations"
                data-place="right">

                <a data-toggle="tab"
                   href="#sync-destinations"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Sync Destinations"
                   onClick={() => setActiveTab('sync-destinations')}>
                    <Share2 aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.preferences}
                data-tip="Preferences"
                data-place="right">

                <a data-toggle="tab"
                   href="#preferences"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Preferences"
                   onClick={() => setActiveTab('preferences')}>
                    <Settings aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.actions}
                data-tip="Actions"
                data-place="right">

                <a data-toggle="tab"
                   href="#actions"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Actions"
                   onClick={() => setActiveTab('actions')}>
                    <Wrench aria-hidden="true" />
                </a>
            </li>
        </ul>
    );
};

export default SideNav;
