import React, { useEffect, useRef } from 'react';

export default function Popup({ message, lifetime }) {
  const mainRef = useRef();
  const timeoutRef = useRef();

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    main.style.display = 'none';
    timeoutRef.current = setTimeout(() => (main.style.display = 'block'), 100);

    return () => clearTimeout(timeoutRef.current);
  }, [message, mainRef]);

  return (
    <div ref={mainRef} className='popup' style={{ '--lifetime': lifetime }}>
      {message.text}
    </div>
  );
}
