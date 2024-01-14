import { useCallback, useMemo } from 'react';

const ERROR_MESSAGES = {
  nameTypeError: 'is not a valid cookie name. "name" argument must be a string value.',
  valueTypeError: 'is not a valid cookie value. "value" argument must be a string, number, object or boolean value.',
};

export default function useCookies() {
  const set = useCallback((name, value, options = { path: '/' }) => {
    if (typeof name !== 'string') throw new TypeError(name + ' ' + ERROR_MESSAGES.nameTypeError);
    if (['string', 'number', 'object', 'boolean'].indexOf(typeof value) === -1)
      throw new TypeError(value + ' ' + ERROR_MESSAGES.valueTypeError);
    document.cookie =
      `${name.trim()}=${JSON.stringify(value)};` +
      Object.entries(options).map((en) => {
        return `${en[0]}=${en[1]};`;
      });
  }, []);

  const get = useCallback((name) => {
    const cookie = document.cookie
      .split(';')
      .map((c) => c.trim())
      .find((c) => {
        return c.indexOf(name + '=') === 0;
      });

    return cookie ? JSON.parse(cookie.substring(name.length + 1)) : undefined;
  }, []);

  const remove = useCallback((name) => {
    const expiresAt = new Date(Date.now() - 60 * 60 * 1000).toUTCString();

    document.cookie = `${name}=; expires=${expiresAt};`;
  }, []);

  const Cookies = useMemo(() => {
    return { set, get, remove };
  }, [get, remove, set]);

  return Cookies;
}
