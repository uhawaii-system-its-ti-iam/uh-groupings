import QuestionItem from '@/app/about/_components/question-item';
const WhatHappensIfSection = () => {
    const whatHappensIfItems = [
        {
            question:
                'Q: I was an owner of just one grouping and ' +
                'someone (me or another owner) deleted my ownership while I was still logged in.',
            answer:
                'A: You will still see the Groupings menu option, ' +
                'but you will get an error message when you click on it. ' +
                'Next time you log in, the Groupings menu option will no longer appear, ' +
                `assuming that you don't reacquire the ownership of a grouping before then.`
        },
        {
            question: `Q: I was not an owner of any groupings and someone made me an owner while I was still logged in.`,
            answer: `A: You will have to log out and then log back in again to see the Groupings menu option.`
        },
        {
            question:
                'Q: I was an admin and someone (me or another admin) deleted my admin role while while I was still ' +
                'logged in.',
            answer:
                'A: You will still see the Admin menu option, ' +
                'but you will get an error message when you click on it.' +
                ' Next time you log in, the Admin menu option will no longer appear, ' +
                `assuming that you don't reacquire the Admin role before then.`
        }
    ];

    return (
        <div className="bg-seafoam pt-5">
            <div className="container pb-10">
                <h2 className="info-title">WHAT HAPPENS IF</h2>
                <div className="grid gap-8">
                    <QuestionItem data={whatHappensIfItems} />
                </div>
            </div>
        </div>
    );
};

export default WhatHappensIfSection;
