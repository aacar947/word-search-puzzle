import { useCallback, useState } from 'react';

export default function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    const localValue = window.localStorage.getItem(key);
    const value = localValue === undefined ? null : JSON.parse(localValue);

    if (!value) {
      const newValue =
        typeof defaultValue === 'function' ? defaultValue() : defaultValue === undefined ? null : defaultValue;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    }

    return value;
  });
  const setStateAndSaveInLocalStorage = useCallback(
    (value) => {
      const newValue = typeof value === 'function' ? value(state) : value === undefined ? null : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setState(value);
    },
    [key, state]
  );

  return [state, setStateAndSaveInLocalStorage];
}
