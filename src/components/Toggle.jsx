import React, { useId } from 'react';
import Icon from './Icon';

export default function Toggle({ displayWhileOn, displayWhileOff, style, ...rest }) {
  const id = useId();
  return (
    <div>
      <input className='toggle-switch' {...rest} type='checkbox' id={id} />
      <label style={style} className='toggle-label' htmlFor={id}>
        <div className='toggle-label-inner'>
          {displayWhileOff && (typeof displayWhileOff === 'object' ? <Icon {...displayWhileOff} /> : displayWhileOff)}
          {displayWhileOn && (typeof displayWhileOn === 'object' ? <Icon {...displayWhileOn} /> : displayWhileOn)}
        </div>
      </label>
    </div>
  );
}
