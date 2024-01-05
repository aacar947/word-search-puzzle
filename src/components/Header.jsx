import React, { useEffect, useRef, useState } from 'react';
import Timer from './Timer';
import Popup from './Popup';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Header({ wordlist, gameOver }) {
  const [score, setScore] = useState(0);
  const [highScore] = useLocalStorage('highscore', 0);
  const [earned, setEarned] = useState(0);
  const startTime = useRef();

  useEffect(() => {
    const totalScore = wordlist.reduce((score, word) => {
      if (!word.found) return score;
      const relativeTime = Math.max(Math.floor((word.foundAt - startTime.current) / 1000), 1);
      const calc = Math.floor((word.value.length * 250) / Math.log10(relativeTime * 10));
      console.log(relativeTime, word.value.length, calc);
      return score + calc;
    }, 0);
    if (!totalScore) return;
    setScore((prev) => {
      setEarned(totalScore - prev);
      return totalScore;
    });
  }, [wordlist, setScore, setEarned]);

  return (
    <div id='header'>
      <Timer ref={startTime} {...{ gameOver, wordlist, score }} />
      <div id='scoreboard'>
        <div style={{ color: 'gray', position: 'relative' }}>
          Score: <p style={{ color: 'black', margin: '0 5px' }}>{score}</p>
          <Popup lifetime='2s' message={earned ? { text: '+' + earned } : ''} />
        </div>
        <div style={{ color: 'gray' }}>
          {' '}
          High Score:<p style={{ color: 'black', margin: '0 5px' }}>{highScore}</p>{' '}
        </div>
      </div>
    </div>
  );
}
