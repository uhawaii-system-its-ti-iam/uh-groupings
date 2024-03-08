import Image from 'next/image';

const About = () => (
    <main>
        <div className="bg-seafoam pt-10 pb-10">
            <div className="container">
                <div className="grid gap-2">
                    <h1 className="text-center text-4xl font-medium">What is a UH Grouping?</h1>
                    <p className="text-center text-lg">A <em>grouping</em> is a collection of members
                        (e.g., all full-time
                        Hilo faculty).</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pt-3">
                    <div className="col-span-1">
                        <div className="flex justify-center">
                            <Image
                                src="/uhgroupings/cogs.svg"
                                alt="Cogs icon"
                                width={115}
                                height={115}/>
                        </div>
                        <p className="text-center">Create groupings, manage grouping memberships,
                            control members&apos; self-service
                            options, designate sync destinations, and more.</p>
                    </div>

                    <div className="col-span-1">
                        <div className="flex justify-center">
                            <Image
                                src="/uhgroupings/id-email.svg"
                                alt="Email icon"
                                width={115}
                                height={115}/>
                        </div>
                        <p className="text-center">Synchronize groupings email LISTSERV lists, attributes for access
                            control via
                            CAS and LDAP, etc.</p>
                    </div>

                    <div className="col-span-1">
                        <div className="flex justify-center">
                            <Image
                                src="/uhgroupings/watch.svg"
                                alt="Watch icon"
                                width={115}
                                height={115}/>
                        </div>
                        <p className="text-center">Leverage group data from official sources, which can
                            substantially reduce the
                            manual overhead of membership management.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="container pt-10 pb-10">
            <h2 className="text-center text-xl font-bold text-text-color pb-7">GENERAL INFO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <div className="col-span-1">
                    <h3 className="text-text-color text-lg pb-1">How do I request a new grouping?</h3>
                    <p className="pb-7">
                        <a className="text-link-color hover:underline hover:text-link-hover-color"
                            href="https://uhawaii.atlassian.net/wiki/spaces/UHIAM/pages/13402308/UH+Groupings+Request+Form"
                            aria-label="A request form is available">A request form is available</a>.
                    </p>

                    <h3 className="text-text-color text-lg pb-1">Exactly what is a grouping?</h3>
                    <p className="pb-5">
                        <a className="text-link-color hover:underline hover:text-link-hover-color"
                            href="https://uhawaii.atlassian.net/wiki/spaces/UHIAM/pages/13403213/UH+Groupings"
                            aria-label="General information about groupings is available">General information about
                            groupings is available</a>.
                        A grouping&apos;s components include the Basis, Include, and Exclude lists.</p>

                    <h3 className="text-text-color text-lg pb-1">What is the Basis?</h3>
                    <p>A grouping&apos;s Basis is the portion of the grouping membership that
                        is automatically updated. It may be empty.</p>
                </div>
                <div className="col-span-1">
                    <h3 className="text-text-color text-lg pb-1">What is the Include members list?</h3>
                    <p className="pb-5">A grouping&apos;s Include is the portion of the grouping
                        membership that is
                        manually updated.
                        It may be empty.</p>
                    <h3 className="text-text-color text-lg pb-1">What is the Exclude members list?</h3>
                    <p className="pb-5">A grouping&apos;s Exclude overrides automatic
                        and manual membership by explicitly not including anyone listed here. It may be empty.</p>
                </div>
            </div>
        </div>

        <div className="bg-seafoam pt-5">
            <div className="container pb-10">
                <h2 className="text-center text-xl text-text-color font-bold pb-7 pt-5">WHAT HAPPENS IF</h2>
                <div className="grid gap-8">
                    <div>
                        <h3 className="text-text-color text-lg pb-2">Q: I was an owner of just one grouping and
                            someone (me or another owner) deleted my ownership while I was still logged in.</h3>
                        <p>A: You will still see the Groupings menu option, but you will get an error message when
                            you click on it. Next time you log in, the Groupings menu option will no longer appear,
                            assuming that you don&apos;t reacquire the ownership of a grouping before then.</p>
                    </div>
                    <div>
                        <h3 className="text-text-color text-lg pb-2">Q: I was not an owner of any groupings and
                            someone made me an owner while I was still logged in.</h3>
                        <p>A: You will have to log out and then log back in again to see the
                            Groupings menu option.</p>
                    </div>
                    <div>
                        <h3 className="text-text-color text-lg pb-2">Q: I was an admin and someone
                            (me or another admin) deleted my admin role while I was still logged in.</h3>
                        <p>A: You will still see the Admin menu option, but you will get an error
                            message when you click on it. Next time you log in, the Admin menu option will no longer
                            appear, assuming that you don&apos;t reacquire the Admin role before then.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="container pb-10 pt-6">
            <h2 className="text-center text-text-color text-xl font-bold pb-7">TECHNICAL INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1">
                    <h3 className="text-text-color text-lg pb-2">Resources</h3>
                    <p className="pb-3">Source code is available on <a
                        className="text-link-color hover:underline hover:text-link-hover-color"
                        href="https://github.com/uhawaii-system-its-ti-iam/uh-groupings">GitHub</a>
                    </p>
                </div>

                <div className="col-span-3">
                    <h3 className="text-text-color text-lg pb-2">Technologies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-0">
                        <div className="col-span-1">
                            <p className="pb-4">React.js&nbsp;
                                <a className="text-link-color hover:underline hover:text-link-hover-color"
                                    href="https://react.dev/learn"
                                    aria-label="Link to React.js Quickstart"
                                >(Quickstart)</a></p>
                            <p className="pb-4">Next.js&nbsp;
                                <a className="text-link-color hover:underline hover:text-link-hover-color"
                                    href="https://nextjs.org/docs"
                                    aria-label="Link to Next.js Introduction"
                                >(Introduction)</a></p>
                            <p className="pb-4">Typescript&nbsp;
                                <a className="text-link-color hover:underline hover:text-link-hover-color"
                                    href="https://www.typescriptlang.org/docs/"
                                    aria-label="Link to Typescript Guide"
                                >(Guide)</a>
                            </p>
                            <p className="pb-4">Tailwind CSS&nbsp;
                                <a className="text-link-color hover:underline hover:text-link-hover-color"
                                    href="https://v2.tailwindcss.com/docs"
                                    aria-label="Link to Tailwind CSS Guide"
                                >(Guide)</a>
                            </p>
                        </div>
                        <div className="col-span-1">
                            <p className="pb-4">shadcn/ui&nbsp;
                                <a className="text-link-color hover:underline hover:text-link-hover-color"
                                    href="https://ui.shadcn.com/docs"
                                    aria-label="Link to shadcn/ui Guide"
                                >(Guide)</a></p>
                            <p className="pb-4">Tanstack Table&nbsp;
                                <a className="text-link-color hover:underline hover:text-link-hover-color"
                                    href="https://tanstack.com/table/v8/docs/introduction"
                                    aria-label="Link to Tanstack Table Introduction"
                                >(Introduction)</a>
                            </p>
                            <p className="pb-4">Tanstack Query&nbsp;
                                <a className="text-link-color hover:underline hover:text-link-hover-color"
                                    href="https://tanstack.com/query/latest/docs/framework/react/overview"
                                    aria-label="Link to Tanstack Query Guide"
                                >(Guide)</a>
                            </p>
                            <p className="pb-4">Iron Session&nbsp;
                                <a className="text-link-color hover:underline hover:text-link-hover-color"
                                    href="https://github.com/vvo/iron-session"
                                    aria-label="Link to Iron Session GitHub"
                                >(GitHub)</a>
                            </p>
                        </div>
                        <div className="col-span-1">
                            <p className="pb-4">Jest&nbsp;
                                <a className="text-link-color hover:underline hover:text-link-hover-color"
                                    href="https://jestjs.io/docs/getting-started"
                                    aria-label="Link to Jest Introduction"
                                >(Introduction)</a>
                            </p>
                            <p className="pb-4">React Testing Library&nbsp;
                                <a className="text-link-color hover:underline hover:text-link-hover-color"
                                    href="https://testing-library.com/"
                                    aria-label="Link to React Testing Library Documentation"
                                >(Documentation)</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
);

export default About;
