import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {message} from "@/lib/messages";

const GroupingMemberUidCell = ({ uid }: { uid: string }) => {
    return (
        <>
            {uid ? (
                uid
            ) : (
                <span className="text-text-color">
                    N/A{' '}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <FontAwesomeIcon icon={faQuestionCircle} color="black" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-48 text-center whitespace-normal" side="right">
                                {message.Tooltip.UID_NOT_APPLICABLE}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </span>
            )}
        </>
    );
};

export default GroupingMemberUidCell;
