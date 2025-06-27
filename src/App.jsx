import React from "react";
import Die from "./components/Die";
import "./App.css";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import victorySound from "/victory.wav";
import gameOverSound from "/lose.wav";

function App() {
  const [die, setDie] = React.useState(() => generateAllNewDice());
  const [width, height] = useWindowSize();
  const buttonRef = React.useRef(null);
  const [count, setCount] = React.useState(0);
  const maxCount = 15;
  const victoryAudio = React.useRef(new Audio(victorySound));
  const gameOverAudio = React.useRef(new Audio(gameOverSound));

  const gameWon =
    count < maxCount &&
    die.every((dice) => dice.isHeld) &&
    die.every((dice) => dice.value === die[0].value);
  const gameOver = count >= maxCount && !gameWon;

  React.useEffect(() => {
    if (gameWon) {
      victoryAudio.current.play();
    }
  }, [gameWon]);

  React.useEffect(() => {
    if (gameOver) {
      gameOverAudio.current.play();
    }
  }, [gameOver]);

  React.useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
    }
  }, [gameWon]);

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => {
      return {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid(),
      };
    });
  }

  function rollDice() {
    if (!gameWon && !gameOver) {
      setDie((prev) =>
        prev.map((dice) =>
          dice.isHeld ? dice : { ...dice, value: Math.ceil(Math.random() * 6) }
        )
      );
      setCount((prevCount) => prevCount + 1);
    } else {
      victoryAudio.current.pause();
      victoryAudio.current.currentTime = 0;
      gameOverAudio.current.pause();
      gameOverAudio.current.currentTime = 0;

      setDie(generateAllNewDice());
      setCount(0);
    }
  }

  function hold(id) {
    setDie((prev) =>
      prev.map((dice) =>
        dice.id === id ? { ...dice, isHeld: !dice.isHeld } : dice
      )
    );
  }

  const dieElement = die.map((obj) => (
    <Die
      onClick={() => hold(obj.id)}
      key={obj.id}
      value={obj.value}
      isHeld={obj.isHeld}
    />
  ));

  return (
    <>
      {gameWon && (
        <div style={{ position: "fixed", top: 0, left: 0, zIndex: 1000 }}>
          <Confetti width={width} height={height} />
        </div>
      )}
      <main className="game-board">
        {/* {gameWon && <Confetti height={height} width={width} />} */}
        {!gameWon && !gameOver && (
          <div className="section">
            <h1 className="title">Tenzies</h1>
            <p className="instructions">
              Roll until all dice are the same. Click each die to freeze it at
              its current value between rolls.
            </p>
          </div>
        )}
        {!gameWon && !gameOver && <div className="container">{dieElement}</div>}
        <button ref={buttonRef} onClick={rollDice} className="roll-button">
          {gameWon || count >= maxCount ? "New Game" : "Roll"}
        </button>
        {gameWon && (
          <h2 className="game-msg"> 🎉 Congratulations! You won! 🎉</h2>
        )}
        {gameOver && (
          <h2 className="game-msg">💥 Game Over! You ran out of rolls</h2>
        )}
        <small className="rolls">Remaining Rolls: {maxCount - count}</small>
      </main>
    </>
  );
}

export default App;
