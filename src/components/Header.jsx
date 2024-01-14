import React, { useLayoutEffect } from 'react';
import Logo from './Logo';
import Toggle from './Toggle';
import useCookieState from '../hooks/useCookieState';

export default function Header() {
  const [darkTheme, setDarkTheme] = useCookieState('darkTheme', false);

  const style = {
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };

  useLayoutEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkTheme]);

  const onDarkThemeToggle = (e) => {
    if (e.currentTarget.checked) {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
  };
  return (
    <header className='box-shadow'>
      <div style={style} className='flex flex-center'>
        <Logo />
        <Toggle
          displayWhileOn={{ src: './icons/night.svg' }}
          displayWhileOff={{ src: './icons/day.svg' }}
          onChange={onDarkThemeToggle}
          checked={darkTheme}
        />
      </div>
    </header>
  );
}
