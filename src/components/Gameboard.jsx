import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import Table from './Table';
import createPuzzle from '../utils/createPuzzle';
import WordList from './WordList';
import useEventListener from '../hooks/useEventListener';
import Timer from './Timer';
import Popup from './Popup';
import useLocalStorage from '../hooks/useLocalStorage';
import Icon from './Icon';

export const CREATE_GAMEOVER_MODAL_OPTIONS = (score, highScore, size, onPlayAgainClick) => {
  return {
    show: true,
    header: 'Game Over',
    body: `Your Score: ${score} High Score: ${highScore[size.join('x')]}`,
    buttons: [
      {
        props: {
          className: 'modal-btn flex flex-center',
          onClick: onPlayAgainClick,
          iconProps: { src: '../icons/replay.svg' },
        },
        innerText: 'Play Again',
      },
    ],
  };
};

export default function Gameboard({ size = [13, 15], wordCount = 12 }) {
  const [debugMode, setDebugMode] = useState(false);
  const [table, setTable] = useState([]);
  const [wordlist, setWordlist] = useState([]);
  const [windowSize, setWindowSize] = useState([]);
  const gameOver = useRef(false);
  const gameboardRef = useRef();

  // Scale gameboard to fit small screens
  useLayoutEffect(() => {
    setWindowSize([window.innerWidth, window.innerHeight]);
  }, []);

  useEffect(() => {
    console.log(windowSize);
    if (windowSize.length === 0) return;
    const gameboard = gameboardRef.current;
    const parent = gameboard.closest('main');
    const boardWidth = gameboard.offsetWidth;
    const boardHeight = gameboard.offsetHeight;
    const screenWidth = parent.offsetWidth;
    const screenHeight = parent.offsetHeight;

    let ratio = 1;

    if (screenHeight < boardHeight) ratio = Math.floor((screenHeight / boardHeight) * 100) / 100;
    if (screenWidth < boardWidth) ratio = Math.floor((screenWidth / boardWidth) * 100) / 100;
    console.log({ ratio, screenHeight, screenWidth, boardHeight, boardWidth });

    gameboard.style.setProperty('--scale-ratio', ratio);
  }, [windowSize]);

  useEventListener('resize', (e) => {
    setWindowSize([e.target.innerWidth, e.target.innerHeight]);
  });
  // ctl + alt + "D" for toggling debug mode
  // Basicly a cheat code :)
  useEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.keyCode === 68) setDebugMode(!debugMode);
  });

  useLayoutEffect(() => {
    const [_table, _wordlist] = createPuzzle(size[0], size[1], wordCount);
    setTable(_table);
    setWordlist(_wordlist);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id='gameboard' style={{ position: 'relative' }}>
      <div ref={gameboardRef} id='gameboard-center' className='user-select-none'>
        <Header {...{ wordlist, windowSize, gameOver, size }} />
        <Table
          {...{
            table,
            gameOver,
            debugMode,
            size,
            wordlist,
            setWordlist,
            windowSize,
          }}
        />
        <WordList wordlist={wordlist}></WordList>
      </div>
    </div>
  );
}

function Header({ wordlist, gameOver, size }) {
  const [score, setScore] = useState(0);
  const [highScore] = useLocalStorage('highscore', { [size.join('x')]: 0 });
  const [earned, setEarned] = useState(0);
  const startTime = useRef();

  useEffect(() => {
    const totalScore = wordlist.reduce((score, word) => {
      if (!word.found) return score;
      const relativeTime = Math.max(Math.floor((word.foundAt - startTime.current) / 1000), 1);
      const calc = Math.floor((word.value.length * 250) / Math.log10(relativeTime * 10));

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
      <Timer ref={startTime} {...{ gameOver, wordlist, score, size }}>
        <Icon src='../icons/timer.svg' />
      </Timer>
      <div id='scoreboard'>
        <div style={{ color: 'gray', position: 'relative' }}>
          Score: <p style={{ color: 'black', margin: '0 5px' }}>{score}</p>
          <Popup lifetime='2s' message={earned ? { text: '+' + earned } : ''} />
        </div>
        <div style={{ color: 'gray' }}>
          High Score:<p style={{ color: 'black', margin: '0 5px' }}>{highScore[size.join('x')] || 0}</p>{' '}
        </div>
      </div>
    </div>
  );
}
