function Option({ question, dispatch, answer }) {
    console.log('Option', question)

    console.log('Option', question.options.map((option) => {
        console.log(option)
    }))

    const hasAnswer = answer !== null;

    return (
        <div className="options">
            {question.options.map((option, index) => {
                console.log(option)
                return <button 
                onClick={() => {
                    dispatch({ type: "newAnswer", payload: index })
                }}
                disabled={answer !== null}
                className={`btn btn-option ${index === answer ? 'answer' : ''} 
                ${hasAnswer ? index === question.correctOption ? 'correct' : 'wrong' : ''}`} 
                key={option}>
                    {option}
                </button>
            })}
        </div>
    )
}

export default Option
