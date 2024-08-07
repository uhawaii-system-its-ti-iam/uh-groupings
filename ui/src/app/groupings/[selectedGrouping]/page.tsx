'use client';

import { useState } from 'react';
import GroupingBody from '@/app/groupings/[selectedGrouping]/_components/grouping-body';
import ExportDropdown from '@/app/groupings/[selectedGrouping]/_components/export-dropdown';
import ReturnButtons from '@/app/groupings/[selectedGrouping]/_components/return-buttons';
import GroupingHeader from '@/app/groupings/[selectedGrouping]/_components/grouping-header';

const SelectedGrouping = ({ params }: { params: { selectedGrouping: string } }) => {
    const [fromManageSubject, setFromManageSubject] = useState(false);
    const [paginatingComplete, setPaginatingComplete] = useState(true);
    const [groupingMembers, setGroupingMembers] = useState([]);
    const [groupingBasis, setGroupingBasis] = useState([]);
    const [groupingInclude, setGroupingInclude] = useState([]);
    const [groupingExclude, setGroupingExclude] = useState([]);
    const [descriptionLoaded, setDescriptionLoaded] = useState(true);
    const [descriptionForm, setDescriptionForm] = useState(false);
    const [groupingDescription, setGroupingDescription] = useState('');
    const [modelDescription, setModelDescription] = useState('');
    const maxDescriptionLength = 98;

    const returnToGroupingsList = () => {};
    const cancelDescriptionEdit = () => {};
    const toggleShowAdminTab = () => {};
    const returnToManageSubject = () => {};
    const isGroupingEmpty = () => {};
    const exportGroupToCsv = (group, type) => { console.log(`Exporting ${type}:`, group); };
    const getCSVToolTipMessage = () => { return 'Tooltip Message'; };
    const descriptionDisplay = () => { return groupingDescription; };
    const editDescription = () => {};
    const saveDescription = () => {};
    const descriptionLengthWarning = () => { return false; };

    return (
        <main>
            <div className="bg-seafoam pt-4">
                <div className="container">
                    <h1 className="mb-1 font-bold text-[2rem] text-center md:text-left">
                        Manage My Groupings
                    </h1>
                    <p className="pb-3 text-xl text-center md:text-left">
                        View and manage groupings I own. Manage members, configure grouping options and sync destinations.
                    </p>
                </div>
            </div>
            <div className="bg-white">
                <div className="container">

                    <div className="mt-4">
                        <ReturnButtons
                            fromManageSubject={fromManageSubject}
                            returnToGroupingsList={returnToGroupingsList}
                            returnToManageSubject={returnToManageSubject}
                            cancelDescriptionEdit={cancelDescriptionEdit}
                            toggleShowAdminTab={toggleShowAdminTab}
                        />
                        <ExportDropdown
                            paginatingComplete={paginatingComplete}
                            isGroupingEmpty={isGroupingEmpty}
                            groupingMembers={groupingMembers}
                            groupingBasis={groupingBasis}
                            groupingInclude={groupingInclude}
                            groupingExclude={groupingExclude}
                            exportGroupToCsv={exportGroupToCsv}
                            getCSVToolTipMessage={getCSVToolTipMessage}
                        />
                    </div>

                </div>


                <div className="container hide-content" id="sel">
                    {/*<div class="container hide-content" id="sel" th:classappend="${tabContent ? 'card-tab-content' : ''}">*/}
                    <div className="overflow-hidden mb-5 mt-0" ng-init="changeStyleAttribute('sel', 'display', 'unset')">

                        <section>
                            <GroupingHeader
                                selectedGrouping={params.selectedGrouping}
                                descriptionDisplay={descriptionDisplay}
                                editDescription={editDescription}
                                descriptionForm={descriptionForm}
                                descriptionLoaded={descriptionLoaded}

                                modelDescription={modelDescription}
                                setModelDescription={setModelDescription}
                                maxDescriptionLength={maxDescriptionLength}
                                saveDescription={saveDescription}
                                cancelDescriptionEdit={cancelDescriptionEdit}
                                descriptionLengthWarning={descriptionLengthWarning}
                            />
                        </section>

                        <section>
                                <GroupingBody/>
                        </section>

                    </div>
                </div>
            </div>
        </main>
    );
};

export default SelectedGrouping;
