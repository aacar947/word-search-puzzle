import React from 'react';
import Logo from './Logo';
import Toggle from './Toggle';

export default function Header() {
  const style = {
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };

  const onDarkThemeToggle = (e) => {
    if (e.currentTarget.checked) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
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
        />
      </div>
    </header>
  );
}
