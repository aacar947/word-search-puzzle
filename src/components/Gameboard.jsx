import React, { useState, useLayoutEffect, useRef } from 'react';
import Table from './Table';
import createPuzzle from '../utils/createPuzzle';
import WordList from './WordList';
import Header from './Header';
import useEventListener from '../hooks/useEventListener';

export const CREATE_GAMEOVER_MODAL_OPTIONS = (score, highScore, onPlayAgainClick) => {
  return {
    show: true,
    header: 'Game Over',
    body: `Your Score: ${score} High Score: ${highScore}`,
    buttons: [{ props: { className: 'modal-btn', onClick: onPlayAgainClick }, innerText: 'Play Again' }],
  };
};

export default function Gameboard({ size = [15, 17], wordCount = 12 }) {
  const [debugMode, setDebugMode] = useState(false);
  const [table, setTable] = useState([]);
  const [wordlist, setWordlist] = useState([]);
  const gameOver = useRef(false);

  const [windowSize, setWindowSize] = useState();

  useEventListener('resize', (e) => {
    setWindowSize([e.target.innerHeight, e.target.innerWidth]);
  });
  // ctl + alt + "D" for toggling debug mode
  // Basicly a cheat code :)
  useEventListener('keydown', (e) => {
    console.log(e);
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
      <div id='gameboard-center'>
        <Header {...{ wordlist, windowSize, gameOver }} />
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
