import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { optOut } from '@/lib/actions';

const MembershipsOptOutCell = ({ optOutEnabled, groupingPath }: { optOutEnabled: boolean; groupingPath: string }) => {
    const handleOptOut = async () => {

        await optOut(groupingPath);
        window.location.reload();

    };
    return (
        <div className="flex justify-end items-center w-full h-full">
            {optOutEnabled ? (
                <Button className="w-[85px] h-[23px]" onClick={handleOptOut}>
                    <FontAwesomeIcon icon={faUserMinus} />
                </Button>
            ) : (
                <span className="text-text-color font-normal text-[1rem] pr-3">Required</span>
            )}
        </div>
    );
};

export default MembershipsOptOutCell;
