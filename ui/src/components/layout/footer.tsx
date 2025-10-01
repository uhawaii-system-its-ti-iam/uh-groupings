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
                        height={235}
                    />
                </div>
                <div className="col-span-6 md:col-span-7 lg:col-span-8 text-white">
                    <p>
                        The University of Hawai&#699;i is an&nbsp;
                        <a
                            href="https://www.hawaii.edu/offices/eeo/policies/?policy=antidisc"
                            className="underline hover:text-gray-300"
                        >
                            equal opportunity institution
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
