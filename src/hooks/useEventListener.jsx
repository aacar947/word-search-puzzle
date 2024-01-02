import { useEffect, useRef } from 'react';

export default function useEventListener(eventName, callback, node = window) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    if (node == null) return;
    const handler = (e) => callbackRef.current(e);
    node.addEventListener(eventName, handler);
    return () => node.removeEventListener(eventName, handler);
  }, [eventName, node]);
}
