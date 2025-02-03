import { isDepartmental } from '@/lib/access/authorization';
import { faSchool } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const GroupingMemberNameCell = ({ name, uid, uhUuid }: { name: string; uid: string; uhUuid: string }) => {
    return (
        <>
            {name}{' '}
            {isDepartmental(uid, uhUuid) && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <div
                                className={`ml-1 bg-blue-background rounded-full flex justify-center items-center 
                                h-6 w-6`}
                            >
                                <FontAwesomeIcon
                                    icon={faSchool}
                                    size="sm"
                                    aria-label="Departmental Account Icon"
                                    inverse
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-52 text-center text-wrap" side="right">
                            This is a departmental account, not a personal account. Departmental accounts are often
                            shared by multiple individuals and used for external communications.
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </>
    );
};

export default GroupingMemberNameCell;
