import React, { useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { DisplayDynamicModal, DisplaySyncDestModal, ToolTip } from './UIComponents';

const SyncDestinations = () => {
    const [includeCheck, setIncludeCheck] = useState(false);
    const [includeDisable, setIncludeDisable] = useState(false);
    const [excludeCheck, setExcludeCheck] = useState(false);
    const [excludeDisable, setExcludeDisable] = useState(false);
    const [listservCheck, setListservCheck] = useState(false);
    const [listservDisable, setListservDisable] = useState(false);

    const [isHoveredInclude, setIsHoveredInclude] = useState(false);
    const [isHoveredExclude, setIsHoveredExclude] = useState(false);
    const [isHoveredListserv, setIsHoveredListserv] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [syncType, setSyncType] = useState('');
    const [pendingCheckbox, setPendingCheckbox] = useState(null);

    const handleCheckboxClick = (checkboxType) => {
        setPendingCheckbox(checkboxType);

        // Set the syncType dynamically based on the checkbox type
        let selectedSyncType = '';
        switch (checkboxType) {
            case 'include':
                selectedSyncType = 'CAS/LDAP: uhReleasedGrouping';
                break;
            case 'exclude':
                selectedSyncType = 'Google-Group: Email';
                break;
            case 'listserv':
                selectedSyncType = 'LISTSERV: Email';
                break;
            default:
                break;
        }

        setSyncType(selectedSyncType);
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmation = (confirmed) => {
        if (confirmed && pendingCheckbox) {
            switch (pendingCheckbox) {
                case 'include':
                    setIncludeCheck((prev) => !prev);
                    break;
                case 'exclude':
                    setExcludeCheck((prev) => !prev);
                    break;
                case 'listserv':
                    setListservCheck((prev) => !prev);
                    break;
                default:
                    break;
            }
        }
        setPendingCheckbox(null);
        setIsConfirmationModalOpen(false);
        setSyncType(''); // Reset syncType when closing modal
    };

    const clickWithEnter = (event, checkboxType) => {
        if (event.keyCode === 13) {
            handleCheckboxClick(checkboxType);
        }
    };

    const resetGroup = (event) => {
        event.preventDefault();
    };

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    return (
        <div id="actions-display" className="block">
            <div className="flex flex-wrap">
                {/* Ensure the container has no margin and uses full width */}
                <div className="w-full pr-4 pl-4">
                    {/* Heading aligned with the paragraph */}
                    <h1 className="font-bold text-3xl text-gray-900 mt-4 ml-0">Synchronization Destinations</h1>
                    {/* Paragraph with full width and aligned to the left */}
                    <p className="text-gray-900 mb-2 w-full ml-0">
                        Changes made may not take effect immediately. Usually, 3-5 minutes should be anticipated. In extreme cases, a request may take several hours to be fully processed, depending on the number of members and the synchronization destination.
                    </p>
                </div>
            </div>
            <br />
            <div className="flex flex-wrap pt-4 pb-5">
                <div className="md:w-2/3 pr-4 pl-4 -ml-2">
                    <h3 className="text-xl text-cyan-800 mt-0">Sync Destinations</h3>
                    <div>
                        <form onSubmit={resetGroup}>
                            {/* Include Checkbox */}
                            <div className="flex items-center mb-0">
                                <input
                                    type="checkbox"
                                    className="ml-5"
                                    id="resetIncludeCheck"
                                    onChange={() => handleCheckboxClick('include')}
                                    checked={includeCheck}
                                    disabled={includeDisable}
                                    onKeyDown={(event) => clickWithEnter(event, 'include')}
                                />
                                <label className="text-gray-900 pl-2 mb-0" htmlFor="resetIncludeCheck">
                                    CAS/LDAP: uhReleasedGrouping
                                </label>
                                <div
                                    className="relative ml-2"
                                    onMouseEnter={() => setIsHoveredInclude(true)}
                                    onMouseLeave={() => setIsHoveredInclude(false)}
                                    onClick={() => openModal('Synchronize an individual’s membership with the individual’s CAS/LDAP attribute uhReleasedGrouping. ')}
                                >
                                    <MessageCircleQuestion className="w-6 h-6 cursor-pointer" />
                                    {isHoveredInclude && (
                                        <ToolTip message="Synchronize an individual’s membership with the individual’s CAS/LDAP attribute uhReleasedGrouping." />
                                    )}
                                </div>
                            </div>

                            {/* Exclude Checkbox */}
                            <div className="flex items-center mb-0">
                                <input
                                    type="checkbox"
                                    className="ml-5"
                                    id="resetExcludeCheck"
                                    onChange={() => handleCheckboxClick('exclude')}
                                    checked={excludeCheck}
                                    disabled={excludeDisable}
                                    onKeyDown={(event) => clickWithEnter(event, 'exclude')}
                                />
                                <label className="text-gray-900 pl-2 mb-0" htmlFor="resetExcludeCheck">
                                    Google-Group: Email
                                </label>
                                <div
                                    className="relative ml-2"
                                    onMouseEnter={() => setIsHoveredExclude(true)}
                                    onMouseLeave={() => setIsHoveredExclude(false)}
                                    onClick={() => openModal('Synchronize the grouping\'s membership with the corresponding Google Group. ')}
                                >
                                    <MessageCircleQuestion className="w-6 h-6 cursor-pointer" />
                                    {isHoveredExclude && (
                                        <ToolTip message="Synchronize the grouping's membership with the corresponding Google Group." />
                                    )}
                                </div>
                            </div>

                            {/* LISTSERV Checkbox */}
                            <div className="flex items-center mb-0">
                                <input
                                    type="checkbox"
                                    className="ml-5"
                                    id="resetListservCheck"
                                    onChange={() => handleCheckboxClick('listserv')}
                                    checked={listservCheck}
                                    disabled={listservDisable}
                                    onKeyDown={(event) => clickWithEnter(event, 'listserv')}
                                />
                                <label className="text-gray-900 pl-2 mb-0" htmlFor="resetListservCheck">
                                    LISTSERV: Email
                                </label>
                                <div
                                    className="relative ml-2"
                                    onMouseEnter={() => setIsHoveredListserv(true)}
                                    onMouseLeave={() => setIsHoveredListserv(false)}
                                    onClick={() => openModal('Synchronize the grouping\'s membership with a corresponding LISTSERV list, which will be created as needed. ')}
                                >
                                    <MessageCircleQuestion className="w-6 h-6 cursor-pointer" />
                                    {isHoveredListserv && (
                                        <ToolTip message="Synchronize the grouping's membership with a corresponding LISTSERV list, which will be created as needed." />
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Icon-related Modal */}
            {isModalOpen && (
                <DisplayDynamicModal
                    title="Sync Destinations Information"
                    message={modalContent}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {/* Confirmation Modal with Warning */}
            {isConfirmationModalOpen && (
                <DisplaySyncDestModal
                    title="Synchronization Destination Confirmation"
                    onClose={() => handleConfirmation(false)}
                    onConfirm={() => handleConfirmation(true)}
                    syncType={syncType} // Pass the syncType to the modal
                />
            )}
        </div>
    );
};

export default SyncDestinations;


