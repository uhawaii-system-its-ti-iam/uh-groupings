import React, { useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { Modal, ToolTip } from './UIComponents';

const Actions = () => {
    const [includeCheck, setIncludeCheck] = useState(false);
    const [includeDisable, setIncludeDisable] = useState(false);
    const [excludeCheck, setExcludeCheck] = useState(false);
    const [excludeDisable, setExcludeDisable] = useState(false);

    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    return (
        <div id="actions-display" className="block">
            <div className="flex flex-wrap">
                <div className="md:w-2/3 pr-4 pl-4">
                    <h1 className="font-bold text-3xl text-gray-900 mt-4 -ml-2 inline-block">Grouping Actions</h1>
                    <p className="text-gray-900 -ml-2 mb-2">
                        Changes made may not take effect immediately. Usually, 3-5 minutes should be anticipated. In extreme cases, a request may take several hours to be fully processed, depending on the number of members and the synchronization destination.
                    </p>
                </div>
            </div>
            <br />
            <div className="flex flex-wrap pt-4 pb-5">
                <div className="md:w-2/3 pr-4 pl-4 -ml-2">
                    <h3 className="text-xl text-cyan-800 mt-0">Reset Grouping</h3>
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
                                <label className="text-gray-900 pl-2 mb-0" htmlFor="resetIncludeCheck">Reset Include</label>
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
                                <label className="text-gray-900 pl-2 mb-0" htmlFor="resetExcludeCheck">Reset Exclude</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-2 rounded text-xs"
                                    type="submit"
                                    disabled={!includeCheck && !excludeCheck}
                                >
                                    Reset Selected
                                </button>
                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <MessageCircleQuestion className="w-6 h-6 cursor-pointer" />
                                    {isHovered && !isModalOpen && (
                                        <ToolTip message="Reset the grouping by removing all of the members in the include or exclude or both." />
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    title="Actions Information"
                    message="Reset the grouping by removing all of the members in the include or exclude or both."
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Actions;