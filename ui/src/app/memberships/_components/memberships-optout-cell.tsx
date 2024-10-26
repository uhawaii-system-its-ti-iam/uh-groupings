import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';

const MembershipsOptOutCell = ({ optOutEnabled }: { optOutEnabled: boolean }) => {
    return (
        <div className="flex justify-end items-center w-full h-full">
            {optOutEnabled ? (
                <Button className="w-[85px] h-[23px]">
                    <FontAwesomeIcon icon={faUserMinus} />
                </Button>
            ) : (
                <span className="text-text-color font-normal text-[1rem] pr-3">
                    Required
                </span>
            )}
        </div>
    );
};

export default MembershipsOptOutCell;
