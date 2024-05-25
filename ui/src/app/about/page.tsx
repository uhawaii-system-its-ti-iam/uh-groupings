import UHGroupingsInfo from '@/components/uh-groupings-info';
import GeneralInfoSection from '@/app/about/_components/general-info-section';
import WhatHappensIfSection from '@/app/about/_components/what-happens-if-section';
import TechnicalInfoSection from '@/app/about/_components/technical-info-section';

const About = () => (
    <main>
        <UHGroupingsInfo />
        <GeneralInfoSection />
        <WhatHappensIfSection />
        <TechnicalInfoSection />
    </main>
);

export default About;
