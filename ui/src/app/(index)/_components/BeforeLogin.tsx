import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import UHGroupingsInfo from '@/components/UHGroupingsInfo';

const BeforeLogin = () => (
    <main className="bg-seafoam pb-10">
        <UHGroupingsInfo size='lg'/>
        <div className="row">
            <div className="text-center">
                <a href="https://uhawaii.atlassian.net/wiki/spaces/UHIAM/pages/13403213/UH+Groupings">
                    <Button size="lg" variant="default">
                            Learn More <ArrowRight className="ml-1"/>
                    </Button>
                </a>
            </div>
        </div>
    </main>
);

export default BeforeLogin;
