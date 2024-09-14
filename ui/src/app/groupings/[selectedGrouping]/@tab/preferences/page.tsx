'use client';
import{optIn,optOut} from "@/actions/groupings-api";
import React, { useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { DisplayDynamicModal, ToolTip } from '@/app/groupings/[selectedGrouping]/@tab/UIComponents';
//test
const Preferences = () => {
    const [includeCheck, setIncludeCheck] = useState(false);
    const [includeDisable, setIncludeDisable] = useState(false);
    const [excludeCheck, setExcludeCheck] = useState(false);
    const [excludeDisable, setExcludeDisable] = useState(false);

    const [isHoveredInclude, setIsHoveredInclude] = useState(false);
    const [isHoveredExclude, setIsHoveredExclude] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const updateIncludeCheck = () => setIncludeCheck(!includeCheck);
    const updateExcludeCheck = () => setExcludeCheck(!excludeCheck);

    const clickWithEnter = (event, callback) => {
        if (event.keyCode === 13) {
            callback();
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
                    <h1 className="font-bold text-3xl text-gray-900 mt-4 ml-0">Preferences</h1>
                    {/* Paragraph with full width and aligned to the left */}
                    <p className="text-gray-900 mb-2 w-full ml-0">
                        Changes made may not take effect immediately. Usually, 3-5 minutes should be anticipated. In extreme cases, a request may take several hours to be fully processed, depending on the number of members and the synchronization destination.
                    </p>
                </div>
            </div>
            <br />
            <div className="flex flex-wrap pt-4 pb-5">
                <div className="md:w-2/3 pr-4 pl-4 -ml-2">
                    <h3 className="text-xl text-cyan-800 mt-0">User Options</h3>
                    <div>
                        <form onSubmit={resetGroup}>
                            <div className="flex items-center mb-0">
                                <input
                                    type="checkbox"
                                    className="ml-5"
                                    id="resetIncludeCheck"
                                    onChange={updateIncludeCheck}
                                    checked={includeCheck}
                                    disabled={includeDisable}
                                    onKeyDown={(event) => clickWithEnter(event, updateIncludeCheck)}
                                />
                                <label className="text-gray-900 pl-2 mb-0" htmlFor="resetIncludeCheck">
                                    Allow people to add themselves to this group
                                </label>
                                <div
                                    className="relative ml-2"
                                    onMouseEnter={() => setIsHoveredInclude(true)}
                                    onMouseLeave={() => setIsHoveredInclude(false)}
                                    onClick={() => openModal('Enable the opt-in self-service so that new members can discover and join this grouping. ')}
                                >
                                    <MessageCircleQuestion className="w-6 h-6 cursor-pointer" />
                                    {isHoveredInclude && (
                                        <ToolTip message="Enable the opt-in self-service so that new members can discover and join this grouping. " />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center mb-0">
                                <input
                                    type="checkbox"
                                    className="ml-5"
                                    id="resetExcludeCheck"
                                    onChange={updateExcludeCheck}
                                    checked={excludeCheck}
                                    disabled={excludeDisable}
                                    onKeyDown={(event) => clickWithEnter(event, updateExcludeCheck)}
                                />
                                <label className="text-gray-900 pl-2 mb-0" htmlFor="resetExcludeCheck">
                                    Allow people to remove themselves from this group
                                </label>
                                <div
                                    className="relative ml-2"
                                    onMouseEnter={() => setIsHoveredExclude(true)}
                                    onMouseLeave={() => setIsHoveredExclude(false)}
                                    onClick={() => openModal('Enable the opt-out self-service so that members can leave at any time. ')}
                                >
                                    <MessageCircleQuestion className="w-6 h-6 cursor-pointer" />
                                    {isHoveredExclude && (
                                        <ToolTip message="Enable the opt-out self-service so that members can leave at any time. " />
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <DisplayDynamicModal
                    title="Preferences Information"
                    message={modalContent}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Preferences;

