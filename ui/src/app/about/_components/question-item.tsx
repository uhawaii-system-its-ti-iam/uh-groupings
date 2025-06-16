type QuestionData = {
    question: string;
    answer: string;
};

type QuestionItemProps = {
    data: QuestionData[];
    col: number;
};

const QuestionItem = ({ data, col }: QuestionItemProps) => {
    // Calculates number of columns based on the length of data
    const columns = col || Math.ceil(data.length / 3);

    // Create styles for grid columns dynamically
    const gridStyle = {
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
    };

    return (
        <div className="grid gap-8" style={gridStyle}>
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
