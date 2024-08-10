const Heading = ({
    title,
    description,
    children
}: {
    title: string;
    description: string;
    children?: React.ReactNode;
}) => {
    return (
        <div className="bg-seafoam pt-3">
            <div className="container">
                <h1 className="mb-1 font-bold text-[2rem] text-center md:text-left">
                    {title}
                </h1>
                <p className="pb-8 text-xl text-center md:text-left">
                    {description}
                </p>
            </div>
            {children}
        </div>
    );
};

export default Heading;
