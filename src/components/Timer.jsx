import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ModalContext } from '../contexts/ModalContextProvider';
import { CREATE_GAMEOVER_MODAL_OPTIONS } from './Gameboard';
import useLocalStorage from '../hooks/useLocalStorage';

const Timer = React.forwardRef(({ wordlist, gameOver, score }, ref) => {
  const startTime = useRef();
  const timeoutRef = useRef();
  const [time, setTime] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('highscore', 0);
  const [, setModalOptions] = useContext(ModalContext);

  useEffect(() => {
    startTime.current = Date.now();
    const interval = 1000;
    let expected = Date.now() - interval;
    const count = () => {
      if (gameOver.current) return;

      const elapsed = Date.now() - startTime.current;

      setTime(elapsed);

      // handle drift
      const dt = Date.now() - expected;
      timeoutRef.current = setTimeout(count, Math.max(0, interval - dt));
      expected += interval;
    };
    timeoutRef.current = setTimeout(count, interval);
    return () => clearTimeout(timeoutRef.current);
  }, [gameOver, ref]);

  useImperativeHandle(ref, () => startTime.current, []);

  useEffect(() => {
    if (wordlist.length === 0 || !wordlist.every((w) => w.found)) return;
    gameOver.current = true;
    clearTimeout(timeoutRef.current);
    if (score > highScore) setHighScore(score);
    setModalOptions(CREATE_GAMEOVER_MODAL_OPTIONS(score, highScore, () => window.location.reload()));
  }, [gameOver, highScore, score, setHighScore, setModalOptions, wordlist]);

  const formatTime = (time) => {
    const sec = Math.floor(time / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    return [hr % 60, min % 60, sec % 60].map((v) => (('' + v).length === 1 ? '0' + v : '' + v)).join(':');
  };

  return <div className='timer'>{formatTime(time)}</div>;
});

export default Timer;
