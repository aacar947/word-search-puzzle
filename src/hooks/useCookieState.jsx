import { useState, useCallback } from 'react';
import useCookies from './useCookies';

export default function useCookieState(name, defaultValue) {
  const Cookies = useCookies();
  const [state, setState] = useState(() => {
    const cookieVal = Cookies.get(name);
    const value = cookieVal === undefined ? null : cookieVal;

    if (!value) {
      const newValue =
        typeof defaultValue === 'function' ? defaultValue() : defaultValue === undefined ? null : defaultValue;
      Cookies.set(name, newValue);
      return newValue;
    }

    return value;
  });

  const setStateAndSaveInCookies = useCallback(
    (value) => {
      const prev = Cookies.get(name);
      const newValue = typeof value === 'function' ? value(prev) : value === undefined ? null : value;
      Cookies.set(name, newValue);
      setState(newValue);
    },
    [name, Cookies, setState]
  );

  return [state, setStateAndSaveInCookies];
}
