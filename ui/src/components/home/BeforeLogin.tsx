import React from 'react';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import UHGroupingsInfo from '@/components/UHGroupingsInfo';

const BeforeLogin = () => {
    return (
        <main className="bg-seafoam pb-10">
            <UHGroupingsInfo h1Color={"text-text-color"} AboutInfoItemSize={"text-1.2"} h1Weight={"font-light"}/>
            <div className="row">
                <div className="text-center">
                    <LearnMoreButton/>
                </div>
            </div>
        </main>
    );
};

const LearnMoreButton = () => {
    return (
        <Link href="https://uhawaii.atlassian.net/wiki/spaces/UHIAM/pages/13403213/UH+Groupings">
            <Button size="lg" variant="default">
                Learn More <ArrowRight className="ml-1"/>
            </Button>
        </Link>
    );
};

export default BeforeLogin;
