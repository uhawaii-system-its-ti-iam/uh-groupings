import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { optIn, optOut } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

const MembershipsOptCell = ({
    isOptOut,
    optOutEnabled,
    groupingPath,
    onActionFinished
}: {
    isOptOut: boolean;
    optOutEnabled?: boolean;
    groupingPath: string;
    onActionFinished?: (path: string) => void;
}) => {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleAction = async () => {
        setIsPending(true);
        try {
            if (isOptOut) {
                await optOut(groupingPath);
            } else {
                await optIn(groupingPath);
            }

            onActionFinished?.(groupingPath);
            router.refresh();
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <div className="flex justify-end items-center w-full h-full">
                {isOptOut && !optOutEnabled ? (
                    <span className="text-text-color font-normal text-[1rem] pr-3">Required</span>
                ) : (
                    <Button
                        data-testid="opt-button"
                        className="w-[85px] h-[23px] disabled:before:opacity-100 disabled:opacity-100"
                        onClick={handleAction}
                        disabled={isPending}
                    >
                        <FontAwesomeIcon icon={isOptOut ? faUserMinus : faUserPlus} />
                    </Button>
                )}
            </div>
            {isPending && (
                <div id="overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Spinner size="lg" />
                </div>
            )}
        </>
    );
};

export default MembershipsOptCell;
