import Option from "./Option"

function Question({question, answer, dispatch}) {
    console.log('Question', question)
    return (
        <div>
            <h4>{question.question}</h4>
            <Option question={question} dispatch={dispatch} answer={answer} />
        </div>
    )
}

export default Question