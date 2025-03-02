import { useState, ReactNode } from 'react';

function useModal() {
    const [modal, setModal] = useState<ReactNode | null>(null);

    function openModal(content: ReactNode) {
        setModal(content);
    }

    function closeModal() {
        setModal(null);
    }

    return {
        modal,
        openModal,
        closeModal,
        isModalOpen: modal !== null
    };
}

export default useModal;
