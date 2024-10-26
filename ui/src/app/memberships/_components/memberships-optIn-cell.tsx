import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { optIn } from '@/lib/actions';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

const MembershipsOptInCell = ({ groupingPath }: { groupingPath: string }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleOptIn = () => {
        startTransition(async () => {
            await optIn(groupingPath);
            await router.refresh();
        });
    };

    return (
        <div className="flex justify-end items-center w-full h-full">
            <Button className="w-[85px] h-[23px]" onClick={handleOptIn} disabled={isPending}>
                {isPending ? (
                    <div
                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                    ></div>
                ) : (
                    <FontAwesomeIcon icon={faUserPlus} />
                )}
            </Button>
        </div>
    );
};

export default MembershipsOptInCell;
