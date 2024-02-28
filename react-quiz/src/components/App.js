import { useEffect, useReducer } from "react"
import DateCounter from "./DateCounter"
import Header from "./Header"
import Main from "./Main"
import Loader from "./Loader"
import Error from "./Error"
import StartScreen from "./StartScreen"
import { ErrorBoundary } from "react-error-boundary"
import Question from "./Question"
import NextButton from "./NextButton"
import Progress from "./Progress"
import FinishScreen from "./FinishScreen"
import Footer from "./Footer"
import Timer from "./Timer"
const initialState = {
  questions: [], 
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: 'ready'};
    case "dataFailed":
      return { ...state, status: 'error'};
    case "start":
      return { ...state, status: 'active', secondsRemaining: state.questions.length * 30};
    case "next":
      const newIndex = state.index + 1;
      if (newIndex >= state.questions.length) {
        return { ...state, status: 'finished'};
      }
      return { ...state, index: newIndex};
    case "newAnswer":
      const question = state.questions.at(state.index);
      const correct = action.payload === question.correctOption;
      const points = correct ? state.points + question.points : state.points;
      return { ...state, answer: action.payload, points };
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null};
    case 'finish':
      return { ...state, status: 'finished', highscore: state.points > state.highscore ? state.points : state.highscrorre};
    case 'restart':
      return { ...initialState, status: 'ready', questions: state.questions};
    case 'tick':
      return { ...state, 
        secondsRemaining: state.secondsRemaining - 1, 
        status: state.secondsRemaining === 0 ? 'finished' : state.status
      };
    default:
      throw new Error('This action type is not supported.');
  }
}

export default function App() {
  const [{questions, status, index, answer, points, highscore, secondsRemaining}, dispatch] = useReducer(reducer, initialState)

  // derived state
  // meaning, we are calculating the value of date based on the value of count
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(function () {
    // fetch data from server

    async function fetchData() {
      fetch('http://localhost:9000/questions')
      .then(response => response.json())
      .then(data => {
        dispatch({ type: "dataReceived", payload: data})
      })
      .catch(error => {
        dispatch({ type: "dataFailed"})
      });
    }

    fetchData()
  }, [])

  return (
    // <div>
    //   <DateCounter />
    // </div>
    <div className="App">
      <ErrorBoundary>
        <Header />
        <Main>
          {status === 'loading' && <Loader />}
          {status === 'error' && <Error />}
          {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
          {status === 'active' && (
            <>
              <Progress 
                index={index}
                numQuestion={numQuestions}
                points={points}
                maxPossiblePoints={maxPossiblePoints}
                answer={answer}
              />
              <Question question={questions[index]} 
              dispatch={dispatch} answer={answer} />
              <Footer>
                <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
                <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index} />
              </Footer>
            </>
          )}
          {status === 'finished' && (
            <FinishScreen maxPossiblePoints={maxPossiblePoints} points={points} dispatch={dispatch} highscore={highscore}/>
          )}
        </Main>
      </ErrorBoundary>
    </div>
  )
}