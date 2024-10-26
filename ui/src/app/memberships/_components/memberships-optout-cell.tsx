import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { optOut } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const MembershipsOptOutCell = ({ optOutEnabled, groupingPath }: { optOutEnabled: boolean; groupingPath: string }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleOptOut = () => {
        startTransition(async () => {
            await optOut(groupingPath);
            await router.refresh();
        });
    };

    return (
        <div className="flex justify-end items-center w-full h-full">
            {optOutEnabled ? (
                <Button className="w-[85px] h-[23px]" onClick={handleOptOut} disabled={isPending}>
                    {isPending ? (
                        <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                        ></div>
                    ) : (
                        <FontAwesomeIcon icon={faUserMinus} />
                    )}
                </Button>
            ) : (
                <span className="text-text-color font-normal text-[1rem] pr-3">Required</span>
            )}
        </div>
    );
};

export default MembershipsOptOutCell;
