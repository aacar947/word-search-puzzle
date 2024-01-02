import React, { useEffect, useRef } from 'react';

export default function Highlight({ start, end, className, windowSize }) {
  const mainRef = useRef(null);

  useEffect(() => {
    if (!start || !end) return;
    const startPos = [start.offsetLeft + start.offsetWidth / 2, start.offsetTop + start.offsetHeight / 2];
    const endPos = [end.offsetLeft + end.offsetWidth / 2, end.offsetTop + end.offsetHeight / 2];
    const x1 = startPos[0],
      y1 = startPos[1],
      x2 = endPos[0],
      y2 = endPos[1];

    const highlight = mainRef.current;
    const d = Math.round(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    const ang = Math.atan2(y2 - y1, x2 - x1); // RAD
    const top = y1 - highlight.offsetHeight / 2;

    highlight.style.width = d + 'px';
    highlight.style.left = x1 + 'px';
    highlight.style.top = top + 'px';
    highlight.style.transform = `rotate(${ang}rad)`;
  }, [start, end, windowSize]);

  return <div className={className ? 'highlight ' + className : 'highlight'} ref={mainRef}></div>;
}
