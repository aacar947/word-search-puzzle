import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logo() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  };
  return (
    <div id='logo' className='flex user-select-none' onClick={handleClick}>
      <div className='logo-word'>WORD</div>
      <div>
        <div className='logo-search'>SEARCH</div>
        <div className='logo-search'>PUZZLE</div>
      </div>
    </div>
  );
}
