import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

/**
 * Renders a member's UH Username, or `N/A` with a tooltip explanation when the
 * uid is missing. Used by grouping-members tables and the owners modal.
 */
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
                                UH Username not available. Either it has not yet been assigned, or the subject is no
                                longer with UH.
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </span>
            )}
        </>
    );
};

export default GroupingMemberUidCell;

