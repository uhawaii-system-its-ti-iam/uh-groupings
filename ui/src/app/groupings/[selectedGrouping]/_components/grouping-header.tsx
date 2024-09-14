'use client';

import { useState, useEffect } from 'react';
import { Edit, CheckCircle, XCircle } from 'lucide-react';
import { updateDescription } from '@/actions/groupings-api';

const GroupingHeader = ({ groupName, description, groupPath }: { groupName: string, description: string, groupPath: string }) => {
    const [descriptionForm, setDescriptionForm] = useState(false);
    const [modelDescription, setModelDescription] = useState(description || '');
    const [currentDescription, setCurrentDescription] = useState(description || '');
    const maxDescriptionLength = 98;

    useEffect(() => {
        setModelDescription(description);
        setCurrentDescription(description);
    }, [description]);

    const editDescription = () => {
        setDescriptionForm(true);
        setModelDescription(currentDescription);
    };

    const saveDescription = async () => {
        await updateDescription(modelDescription, groupPath);
        setDescriptionForm(false);
    };

    const cancelDescriptionEdit = () => {
        setDescriptionForm(false);
    };

    const descriptionDisplay = () => {

        return currentDescription;
    };

    const descriptionLengthWarning = () => {
        return modelDescription.length > maxDescriptionLength;
    };

    return (
        <div className="py-3 px-5 border-b box-border rounded-b-none rounded-t mt-4 mt-0 bg-uh-teal">
            <div className="flex flex-row table m-auto w-full p-0">
                <div className="md:w-2/3 table-footer-group">
                    {groupName && (
                        <h2 className="text-gray-100 mb-0 text-[2rem] text-center md:text-left">
                            {groupName}
                        </h2>
                    )}
                </div>
            </div>

            <div className="flex flex-row">
                <div className="md:w-full">
                    <p className="text-gray-100 mb-0">
                        <b>Path:</b> {groupPath}
                    </p>
                </div>
            </div>

            <div className="flex flex-row">
                <div className="md:w-full">
                    {descriptionForm ? (
                        <p className="text-gray-100 mb-0">
                            <b>Description:</b> {descriptionDisplay()} &nbsp;
                        </p>
                    ) : (
                        <p className="text-gray-100 mb-0 break-words">
                            <b>Description:</b> {descriptionDisplay()} &nbsp;
                            <button
                                onClick={editDescription}
                                className="text-light mr-2 bg-transparent border-0"
                                aria-label="Edit Description"
                                role="button">
                                <Edit size={20} />
                            </button>
                        </p>
                    )}

                    {descriptionForm && (
                        <div className="grouping-description-form">
                            <form className="flex items-center bg-white rounded">
                                <input
                                    className="form-control border-0 bg-transparent outline-none w-full px-2 py-1"
                                    aria-label="Grouping Description"
                                    value={modelDescription}
                                    onChange={(e) => setModelDescription(e.target.value)}
                                    maxLength={maxDescriptionLength} />
                                <span className="ml-2">
                                    <button
                                        type="button"
                                        aria-label="Save description"
                                        className="description-form-button"
                                        onClick={saveDescription}>
                                        <CheckCircle size={20} role="button" aria-hidden="true" />
                                    </button>
                                </span>

                                <span className="ml-2">
                                    <button
                                        type="button"
                                        aria-label="Cancel changes"
                                        className="description-form-button rounded-r"
                                        onClick={cancelDescriptionEdit}>
                                        <XCircle size={20} role="button" aria-hidden="true" />
                                    </button>
                                </span>
                            </form>
                        </div>
                    )}

                    {descriptionLengthWarning() && (
                        <div className="float-md-left alert alert-danger h-50 pt-2 pb-0 pl-2 pr-2 mb-1 mt-1 border fade">
                            <p>Maximum length reached. A grouping&apos;s description cannot exceed {maxDescriptionLength} characters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupingHeader;
