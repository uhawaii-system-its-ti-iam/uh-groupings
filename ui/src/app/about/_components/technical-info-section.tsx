const TechnicalInfoSection = () => {
    const technicalInfoItems = [
        { name: 'React.js', url: 'https://react.dev/learn', description: '(Quickstart)' },
        { name: 'shadcn/ui', url: 'https://ui.shadcn.com/docs', description: '(Guide)' },
        { name: 'Vitest', url: 'https://vitest.dev/guide/', description: '(Introduction)' },
        { name: 'Next.js', url: 'https://nextjs.org/docs', description: '(Introduction)' },
        {
            name: 'Tanstack Table',
            url: 'https://tanstack.com/table/v8/docs/introduction',
            description: '(Introduction)'
        },
        { name: 'React Testing Library', url: 'https://testing-library.com/', description: '(Documentation)' },
        { name: 'Typescript', url: 'https://www.typescriptlang.org/docs/', description: '(Guide)' },
        {
            name: 'Tanstack Query',
            url: 'https://tanstack.com/query/latest/docs/framework/react/overview',
            description: '(Guide)'
        },
        { name: '', url: '', description: '' },
        { name: 'Tailwind CSS', url: 'https://v2.tailwindcss.com/docs', description: '(Guide)' },
        { name: 'Iron Session', url: 'https://github.com/vvo/iron-session', description: '(GitHub)' }
    ];

    return (
        <div className="container pb-10 pt-6">
            <h2 className="text-center text-text-color text-xl font-bold pb-7">TECHNICAL INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1">
                    <h3 className="text-text-color text-lg pb-2">Resources</h3>
                    <p className="pb-3">
                        Source code is available on{' '}
                        <a
                            className="text-link-color hover:underline hover:text-link-hover-color"
                            href="https://github.com/uhawaii-system-its-ti-iam/uh-groupings"
                        >
                            GitHub
                        </a>
                    </p>
                </div>
                <div className="col-span-3">
                    <h3 className="text-text-color text-lg pb-2">Technologies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-0">
                        {technicalInfoItems.map((item, index) => (
                            <div key={index}>
                                <p>
                                    {item.name}&nbsp;
                                    <a
                                        className="text-link-color hover:underline hover:text-link-hover-color"
                                        href={item.url}
                                        aria-label={`Link to ${item.name} ${item.description}`}
                                    >
                                        {item.description}
                                    </a>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicalInfoSection;
