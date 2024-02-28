import { useEffect } from "react"

function Timer({ secondsRemaining, dispatch }) {
    const mins = Math.floor(secondsRemaining / 60)
    const sec = secondsRemaining % 60 // % what is this operator? this is the modulo operator, it returns the remainder of a division
    console.log('Timer rendered', sec, mins)
    useEffect(function () {
        const interval = setInterval(function () {
            dispatch({ type: 'tick' })
        }, 1000)
        return function () {
            clearInterval(interval)
        }
    }, [dispatch])

    return (
        <div className="timer">
            {mins < 10 && '0'}{mins}
            :
            {sec < 10 && '0'}{sec}
        </div>
    )
}

export default Timer
