const WhatHappensIfSection = () => {
    const whatHappensIfItems = [
        {
            question:
                'I was an owner of just one grouping and ' +
                'someone (me or another owner) deleted my ownership while I was still logged in.',
            answer:
                'You will still see the Groupings menu option, ' +
                'but you will get an error message when you click on it. ' +
                'Next time you log in, the Groupings menu option will no longer appear, ' +
                `assuming that you don't reacquire the ownership of a grouping before then.`
        },
        {
            question: `I was not an owner of any groupings and someone made me an owner while I was still logged in.`,
            answer: `You will have to log out and then log back in again to see the Groupings menu option.`
        },
        {
            question:
                'I was an admin and someone (me or another admin) deleted my admin role while while I was still ' +
                'logged in.',
            answer:
                'You will still see the Admin menu option, ' +
                'but you will get an error message when you click on it.' +
                ' Next time you log in, the Admin menu option will no longer appear, ' +
                `assuming that you don't reacquire the Admin role before then.`
        }
    ];

    return (
        <div className="bg-seafoam pt-5">
            <div className="container pb-10">
                <h2 className="text-center text-xl text-text-color font-bold pb-7 pt-5">WHAT HAPPENS IF</h2>
                <div className="grid gap-8">
                    {whatHappensIfItems.map((item, index) => (
                        <div key={index}>
                            <h3 className="text-text-color text-lg pb-2">Q: {item.question}</h3>
                            <p>A: {item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WhatHappensIfSection;
