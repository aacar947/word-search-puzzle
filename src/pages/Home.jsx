import React, { useReducer, useRef, useState, forwardRef, useEffect, useCallback } from 'react';
import Btn from '../components/Btn';
import Icon from '../components/Icon';
import { clamp } from '../utils/helperFunctions';
import useLocalStorage from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';

const SIZE_NUMBER_ACTIONS = {
    increase: 'increase',
    decrease: 'decrease',
  },
  MAX_SIZE = 20,
  MIN_SIZE = 5,
  FAST_NUMBER_CHANGE_SPEED = 100;

export default function Home() {
  const [highScore] = useLocalStorage('highscore', {});
  const [size, setSize] = useState([0, 0]);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/game?size=${size.join('*')}`);
  };
  return (
    <div id='main-menu' className='user-select-none flex flex-center'>
      <form onSubmit={handleSubmit} className='flex-col flex-center'>
        <h1 className='bold font-larger'>High Score: {highScore[size.join('x')] || 0}</h1>
        <SizeSelector setSize={setSize} />
        <PlayBtn type='submit' params={`size=${size.join('*')}`} />
      </form>
    </div>
  );
}

function PlayBtn(props) {
  return (
    <div style={{ maxWidth: 'fit-content', margin: '10px' }}>
      <Btn {...props} className='play-btn flex flex-center'>
        <p>Play</p>
        <div className='arrows'>
          <Icon
            className='animate-jump'
            src='../icons/arrow-head.svg'
            style={{
              '--delay': '0.4s',
              width: '12px',
              height: 'var(--icon-height)',
            }}
          />
          <Icon
            className='animate-jump'
            src='../icons/arrow-head.svg'
            style={{
              '--delay': '0.65s',
              width: '12px',
              height: 'var(--icon-height)',
            }}
          />
          <Icon
            className='animate-jump'
            src='../icons/arrow-head.svg'
            style={{
              '--delay': '0.9s',
              width: '12px',
              height: 'var(--icon-height)',
            }}
          />
        </div>
      </Btn>
    </div>
  );
}

function SizeSelector({ setSize }) {
  const widthInputRef = useRef();
  const heightInputRef = useRef();

  const handleHeightChange = useCallback(
    (e) => {
      setSize([widthInputRef.current.value || 0, e.target.value]);
    },
    [setSize]
  );
  const handleWidthChange = useCallback(
    (e) => {
      setSize([e.target.value, heightInputRef.current.value || 0]);
    },
    [setSize]
  );

  return (
    <div className='flex-col flex-center' style={{ width: '100%' }}>
      <p>Select table size:</p>
      <div className='size-selector round-corner box-shadow'>
        <div className='flex'>
          <InputNumber ref={widthInputRef} onChange={handleWidthChange} min={MIN_SIZE} max={MAX_SIZE} />
          <p style={{ marginTop: '0.5rem', fontWeight: 'light' }}> by </p>
          <InputNumber ref={heightInputRef} onChange={handleHeightChange} min={MIN_SIZE} max={MAX_SIZE} />
        </div>
      </div>
    </div>
  );
}

const InputNumber = forwardRef(function ({ min, max, longPressInterval = 500, onChange, ...rest }, ref) {
  const longPressTimer = useRef();
  const setNumberRepeatedlyInterval = useRef();
  const hasLimit = typeof min === 'number' && typeof max === 'number';
  const [number, setNumber] = useReducer(
    (prev, action) => {
      if (action.type === SIZE_NUMBER_ACTIONS.increase) {
        return hasLimit ? clamp(++prev, min, max) : prev + 1;
      } else if (action.type === SIZE_NUMBER_ACTIONS.decrease) {
        return hasLimit ? clamp(--prev, min, max) : prev - 1;
      } else if (typeof action === 'number') {
        return hasLimit ? clamp(action, min, max) : action;
      } else return min ? min : 0;
    },
    hasLimit ? min + Math.floor((max - min) / 2) : 0
  );

  useEffect(() => {
    if (typeof onChange === 'function') onChange({ target: ref.current });
  }, [ref, number, onChange]);

  const addNumber = (action) => {
    if (!setNumber) return;
    setNumber({ type: action });
  };

  const setNumberRepeatedly = (action) => {
    setNumberRepeatedlyInterval.current = setInterval(() => {
      setNumber({ type: action });
    }, FAST_NUMBER_CHANGE_SPEED);
  };

  const handleLongPress = (action) => {
    handleCancelLongPress();
    longPressTimer.current = setTimeout(() => {
      setNumberRepeatedly(action);
    }, longPressInterval);
  };
  const handleCancelLongPress = () => {
    clearTimeout(longPressTimer.current);
    clearInterval(setNumberRepeatedlyInterval.current);
  };

  const handleFocusOut = (e) => {
    e.target.blur();
    e.target.querySelectorAll('*').forEach((child) => {
      child.blur();
    });
  };
  return (
    <div className='size-input flex flex-center' onMouseLeave={handleFocusOut}>
      <button
        type='button'
        onClick={() => addNumber(SIZE_NUMBER_ACTIONS.decrease)}
        onMouseDown={() => handleLongPress(SIZE_NUMBER_ACTIONS.decrease)}
        onMouseUp={handleCancelLongPress}
        onMouseLeave={handleCancelLongPress}
        onTouchStart={() => handleLongPress(SIZE_NUMBER_ACTIONS.decrease)}
        onTouchEnd={handleCancelLongPress}
      >
        <Icon
          src='../icons/arrow-head.svg'
          style={{ transform: 'rotate(-180deg)', backgroundColor: 'black', width: '1rem', height: '1rem' }}
        />
      </button>
      <input ref={ref} {...rest} readOnly type='number' id='' value={number} />
      <button
        type='button'
        onClick={() => addNumber(SIZE_NUMBER_ACTIONS.increase)}
        onMouseDown={() => handleLongPress(SIZE_NUMBER_ACTIONS.increase)}
        onMouseUp={handleCancelLongPress}
        onMouseLeave={handleCancelLongPress}
        onTouchStart={() => handleLongPress(SIZE_NUMBER_ACTIONS.increase)}
        onTouchEnd={handleCancelLongPress}
      >
        <Icon src='../icons/arrow-head.svg' style={{ backgroundColor: 'black', width: '1rem', height: '1rem' }} />
      </button>
    </div>
  );
});
