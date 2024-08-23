'use client';

import { useRouter } from 'next/navigation';
import {Button} from '@/components/ui/button';
const Groupings = () => {
    const router = useRouter();

    const handleButtonClick = () => {
        const selectedGrouping = 'Path';
        router.push(`/groupings/${selectedGrouping}`);
    };

    return (
        <div className="bg-white">
            <div className="container">
                {/* Add your GroupingsTable here if needed */}
                <Button onClick={handleButtonClick} className="btn btn-primary">
                    Go to Selected Grouping
                </Button>
            </div>
        </div>
    );
};

export default Groupings;
