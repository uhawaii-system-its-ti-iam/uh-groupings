import { Users, CreditCard, UserPlus, UserMinus, Crown, Share2, Settings, Wrench } from 'lucide-react';
import {useState} from 'react';

const SideNav = () => {
    const [groupingExclude, setgroupingExclude] = useState('');
    const [groupingInclude, setgroupingInclude] = useState('');
    
    const resetFields = () => {};
    const transferMembersFromPageToCheckboxObject = () => {};

    return (

        <ul className="flex md:flex-col sm:flex-row md:justify-start justify-center">

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.members}
                data-tip="All Members" data-place="right">
                <a data-toggle="tab" href="#all"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="All Members" onClick={resetFields}>
                    <Users aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.basis}
                data-tip="Basis Members" data-place="right">
                <a data-toggle="tab" href="#basis"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Basis Members" onClick={resetFields}>
                    <CreditCard aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.include}
                data-tip="Include Members" data-place="right">
                <a data-toggle="tab" href="#include"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Include Members" onClick={() => {
                    resetFields();
                    transferMembersFromPageToCheckboxObject(groupingInclude);
                }}>
                    <UserPlus aria-hidden="false" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.exclude}
                data-tip="Exclude Members" data-place="right">
                <a data-toggle="tab" href="#exclude"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Exclude Members" onClick={() => {
                    resetFields();
                    transferMembersFromPageToCheckboxObject(groupingExclude);
                }}>
                    <UserMinus aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.owners}
                data-tip="Grouping Owners" data-place="right">
                <a data-toggle="tab" href="#owners"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Grouping Owners" onClick={resetFields}>
                    <Crown aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.sync-destinations}
                data-tip="Sync Destinations" data-place="right">
                <a data-toggle="tab" href="#sync-destinations"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Sync Destinations">
                    <Share2 aria-hidden="true" />
                </a>
            </li>
            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.preferences}
                data-tip="Preferences" data-place="right">
                <a data-toggle="tab" href="#preferences"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Preferences">
                    <Settings aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0"
                //tooltip data-placement="right"
                //th:title="#{screen.message.common.tooltip.nav.actions}
                data-tip="Actions" data-place="right">
                <a data-toggle="tab" href="#actions"
                   className="py-2 px-4 items-center justify-center"
                   aria-label="Actions">
                    <Wrench aria-hidden="true" />
                </a>
            </li>
        </ul>
    );
}

export default SideNav;
