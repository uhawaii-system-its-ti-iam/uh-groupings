import Image from 'next/image';

const Footer = () => (
    <footer className="top-full py-10 w-full bg-uh-black">
        <div className="container py-2">
            <div className="grid sm:grid-cols-12">
                <div className="mx-auto mb-6 col-span-6 md:col-span-5 lg:col-span-4">
                    <Image
                        src="/uhgroupings/uh-logo-system.svg"
                        alt="UH System logo"
                        width={235}
                        height={82.162}
                        sizes="(max-width: 575px) 210px, (min-width: 576px) 195px, (max-width: 991px) 209.988px, (min-width: 992px) 235px"
                        className="w-[210px] h-[71.463px] sm:w-[195px] sm:h-[66.362px] md:w-[209.988px] md:h-[71.463px] lg:w-[235px] lg:h-[82.162px]"
                    />
                </div>
                <div className="col-span-6 md:col-span-7 lg:col-span-8 text-white">
                    <p>
                        The University of Hawai&#699;i is an&nbsp;
                        <a
                            href="https://www.hawaii.edu/offices/eeo/policies/?policy=antidisc"
                            className="underline hover:text-gray-300"
                        >
                            equal opportunity/affirmative action institution
                        </a>
                        .
                    </p>
                    <p className="mt-4">
                        Use of this site implies consent with our&nbsp;
                        <a
                            href="https://www.hawaii.edu/policy/docs/temp/ep2.210.pdf"
                            className="underline hover:text-gray-300"
                            title="UH Usage Policy"
                        >
                            Usage Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
