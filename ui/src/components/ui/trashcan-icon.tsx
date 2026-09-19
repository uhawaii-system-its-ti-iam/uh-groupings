 import { Trash2Icon } from 'lucide-react';

interface RemoveMemberTrashcanProps {
    onClick: () => void;
    dataTestId?: string;
    ariaLabel?: string;
    className?: string;
    disabled?: boolean;
}

const RemoveMemberTrashcan = ({
                                  onClick,
                                  dataTestId,
                                  ariaLabel,
                                  className = '',
                                  disabled = false
                              }: RemoveMemberTrashcanProps) => {
    return (
        <button
            type="button"
            data-testid={dataTestId}
            aria-label={ariaLabel}
            onClick={onClick}
            disabled={disabled}
            className={`text-red-600 hover:text-red-800 disabled:opacity-50 ${className}`}
        >
            <Trash2Icon className="h-4 w-4" />
        </button>
    );
};

export default RemoveMemberTrashcan;
