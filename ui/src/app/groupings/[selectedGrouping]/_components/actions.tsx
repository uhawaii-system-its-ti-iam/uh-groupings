
import React, { useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';

const Actions = () => {
    const [includeCheck, setIncludeCheck] = useState(false);
    const [includeDisable, setIncludeDisable] = useState(false);
    const [excludeCheck, setExcludeCheck] = useState(false);
    const [excludeDisable, setExcludeDisable] = useState(false);

    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
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

    const toolTip = (message) => {
        return (
            <div className="absolute bg-black text-white p-2 border rounded shadow-lg max-w-full" style={{ left: '100%', top: '0%', transform: 'translateY(-50%)', minWidth: '300px', maxWidth: '600px' }}>
                <div className="relative">
                    <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
                    <p className="text-base whitespace-normal">{message}</p>
                </div>
            </div>
        );
    };

    const Modal = ({ title, message, onClose }) => {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-50"></div>
                <div className="bg-white p-4 rounded shadow-lg z-10 max-w-lg w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl text-cyan-800">{title}</h2>
                        <button onClick={onClose} className="text-black hover:text-gray-700">&times;</button>
                    </div>
                    <hr className="mb-4" />
                    <p>{message}</p>
                    <hr className="mt-4 mb-4" />
                    <div className="flex justify-end mt-4">
                        <button onClick={onClose} className="bg-cyan-700 hover:bg-cyan-800 text-white py-1 px-4 rounded">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div id="actions-display" className="tab-pane opacity-0 opacity-100 block active">
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
                    <h3 className="text-2xl text-cyan-800 mt-0">Reset Grouping</h3>
                    <div>
                        <form onSubmit={resetGroup}>
                            <div className="flex items-center mb-0">
                                <input
                                    type="checkbox"
                                    className="ml-5"
                                    id="resetIncludeCheck"
                                    onClick={updateIncludeCheck}
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
                                    onClick={updateExcludeCheck}
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
                                        toolTip("Reset the grouping by removing all of the members in the include or exclude or both.")
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    title="Actions Information "
                    message="Reset the grouping by removing all of the members in the include or exclude or both. "
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Actions;