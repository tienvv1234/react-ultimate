function FinishScreen({points, maxPossiblePoints, highscore, dispatch}) {
    const percentage = (points / maxPossiblePoints) * 100;
    let emoji;
    if (percentage === 100) {
        emoji = "🎉";
    } else if (percentage > 50) {
        emoji = "👍";
    } else {
        emoji = "👎";
    }
    return (
      <>
        <p className="result">
          <span>{emoji}</span>You scored <strong>{points}</strong> out of 
          <strong>{maxPossiblePoints}</strong> ({Math.ceil(percentage)}%)  
        </p>
        <p className="highscore">(Highscore: {highscore} points)</p>
        <button className="btn btn-ui" onClick={() => dispatch({type: 'restart'})}>
          Restart quiz
        </button>
      </>
    )
}

export default FinishScreen
