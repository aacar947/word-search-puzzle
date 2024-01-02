import React, { useEffect, useRef, useState } from 'react';

export default function Timer({ wordlist }) {
  const startTime = useRef();
  const timeoutRef = useRef();
  const [time, setTime] = useState(0);

  useEffect(() => {
    startTime.current = Date.now();
    const interval = 1000;
    let expected = Date.now() - interval;
    const count = () => {
      const elapsed = Date.now() - startTime.current;

      setTime(elapsed);

      // handle drift
      const dt = Date.now() - expected;
      timeoutRef.current = setTimeout(count, Math.max(0, interval - dt));
      expected += interval;
    };
    timeoutRef.current = setTimeout(count, interval);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (wordlist.length === 0 || !wordlist.every((w) => w.found)) return;
    clearTimeout(timeoutRef.current);
  }, [wordlist]);

  const formatTime = (time) => {
    const sec = Math.floor(time / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    return [hr % 60, min % 60, sec % 60].map((v) => (('' + v).length === 1 ? '0' + v : '' + v)).join(':');
  };

  return <div className='timer'>{formatTime(time)}</div>;
}
