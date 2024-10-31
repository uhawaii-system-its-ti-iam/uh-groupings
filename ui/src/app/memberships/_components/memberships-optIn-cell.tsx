import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { optIn } from '@/lib/actions';

const MembershipsOptInCell = ({ groupingPath }: {groupingPath: string }) => {
    const handleOptOut = async () => {
        await optIn(groupingPath);
        window.location.reload();
    };
    return (
        <div className="flex justify-end items-center w-full h-full">
                <Button className="w-[85px] h-[23px]" onClick={handleOptOut}>
                    <FontAwesomeIcon icon={faUserPlus} />
                </Button>
        </div>
    );
};

export default MembershipsOptInCell;
