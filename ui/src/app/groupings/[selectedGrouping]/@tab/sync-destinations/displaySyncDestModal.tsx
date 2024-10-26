import React from 'react';


interface DynamicModalProps {
    title: string;
    message: string;
    onClose: () => void;
}

interface SyncDestModalProps {
    title: string;
    onClose: () => void;
    onConfirm: () => void;
    syncType: string;
}

interface ToolTipProps {
    message: string;
}

// Modal Component
export const DisplayDynamicModal: React.FC<DynamicModalProps> = ({
                                                                     title,
                                                                     message,
                                                                     onClose,
                                                                 }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white p-4 rounded shadow-lg z-10 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-cyan-800">{title}</h2>
                <button onClick={onClose} className="text-black hover:text-gray-700">
                    &times;
                </button>
            </div>
            <hr className="mb-4" />

            {/* Display the message */}
            <p>{message}</p>

            <hr className="mt-4 mb-4" />
            <div className="flex justify-end mt-4">
                <button
                    onClick={onClose}
                    className="bg-cyan-700 hover:bg-cyan-800 text-white py-1 px-4 rounded"
                >
                    OK
                </button>
            </div>
        </div>
    </div>
);

export const DisplaySyncDestModal: React.FC<SyncDestModalProps> = ({
                                                                       title,
                                                                       onClose,
                                                                       onConfirm,
                                                                       syncType,
                                                                   }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white p-4 rounded shadow-lg z-10 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-cyan-800">{title}</h2>
                <button onClick={onClose} className="text-black hover:text-gray-700">
                    &times;
                </button>
            </div>
            <hr className="mb-4" />

            {/* Display the warning message */}
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
                <p>
                    Please be thoughtful about any changes here as some changes are
                    operationally very expensive. Avoid rapidly enabling and disabling a
                    synchronization destination.
                </p>
            </div>

            {/* Display the confirmation question */}
            <p>
                Are you sure you want to disable the synchronization destination:{' '}
                <strong>{syncType}</strong>?
            </p>

            <hr className="mt-4 mb-4" />
            <div className="flex justify-end mt-4">
                <button
                    onClick={onConfirm}
                    className="bg-cyan-700 hover:bg-cyan-800 text-white py-1 px-4 rounded mr-2"
                >
                    Yes
                </button>
                <button
                    onClick={onClose}
                    className="bg-white text-black border-cyan-700 hover:bg-cyan-700 hover:text-white py-1 px-4 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);


// ToolTip Component
export const ToolTip: React.FC<ToolTipProps> = ({ message }) => (
    <div
        className="absolute bg-black text-white p-2 border rounded shadow-lg max-w-full"
        style={{ left: '100%', top: '0%', transform: 'translateY(-50%)', minWidth: '300px', maxWidth: '600px' }}
    >
        <div className="relative">
            <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
            <p className="text-base whitespace-normal">{message}</p>
        </div>
    </div>
);