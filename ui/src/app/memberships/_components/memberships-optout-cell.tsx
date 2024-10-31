import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserMinus} from '@fortawesome/free-solid-svg-icons';
import {optOut} from '@/lib/actions';

const MembershipsOptOutCell = ({optOutEnabled, groupingPath}: { optOutEnabled: boolean; groupingPath: string }) => {
    const [loading, setLoading] = useState(false);

    const handleOptOut = async () => {
        setLoading(true);
        try {
            await optOut(groupingPath);
        } catch (error) {
            console.error('Error during opt-out:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-end items-center w-full h-full">
            {optOutEnabled ? (
                <Button className="w-[85px] h-[23px]" onClick={handleOptOut} disabled={loading}>
                    {loading ? (
                        <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status">
                        </div>
                    ) : (
                        <FontAwesomeIcon icon={faUserMinus}/>
                    )}
                </Button>
            ) : (
                <span className="text-text-color font-normal text-[1rem] pr-3">Required</span>
            )}
        </div>
    );
};

export default MembershipsOptOutCell;
