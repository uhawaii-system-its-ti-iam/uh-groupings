'use client';

import { useRouter } from 'next/navigation';
import {Button} from '@/components/ui/button';



const Groupings = () => {
    const router = useRouter();
    const selectedGrouping = 'tmp:hokwai:hokwai-single';

    return (
        <div className="bg-white">
            <div className="container">
                <Button onClick={() => {
                    sessionStorage.setItem('fromPage', 'groupings');
                    router.push(`/groupings/${selectedGrouping}/all`);
                }}>
                    To Grouping
                </Button>
            </div>
        </div>
    );
};

export default Groupings;
