import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { optIn, optOut } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const MembershipsOptCell = ({
    isOptOut,
    optOutEnabled,
    groupingPath,
    removeRow
}: {
    isOptOut: boolean;
    optOutEnabled?: boolean;
    groupingPath: string;
    removeRow: (path: string) => void;
}) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAction = () => {
        removeRow(groupingPath);
        startTransition(async () => {
            if (isOptOut) {
                await optOut(groupingPath);
            } else {
                await optIn(groupingPath);
            }
            await router.refresh();
        });
    };

    return (
        <div className="flex justify-end items-center w-full h-full">
            {isOptOut && !optOutEnabled ? (
                <span className="text-text-color font-normal text-[1rem] pr-3">Required</span>
            ) : (
                <Button
                    data-testid="opt-button"
                    className="w-[85px] h-[23px]"
                    onClick={handleAction}
                    disabled={isPending}
                >
                    <FontAwesomeIcon icon={isOptOut ? faUserMinus : faUserPlus} />
                </Button>
            )}
        </div>
    );
};

export default MembershipsOptCell;
