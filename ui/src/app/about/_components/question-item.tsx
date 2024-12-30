type QuestionData = {
    question: string;
    answer: string;
};

type QuestionItemProps = {
    data: QuestionData[]; // Accept an array of question-answer objects
};
const QuestionItem = async ({ data }: QuestionItemProps) => {
    return (
        <div className="grid gap-8">
            {data.map((item, index) => (
                <div key={index}>
                    <h3 className="text-text-color text-lg pb-2">{item.question}</h3>
                    <p>{item.answer}</p>
                </div>
            ))}
        </div>
    );
};

export default QuestionItem;
