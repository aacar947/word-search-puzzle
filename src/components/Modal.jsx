import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext } from '../contexts/ModalContextProvider';

export default function Modal() {
  const [options] = useContext(ModalContext);

  return createPortal(
    <div className='overlay' style={{ display: options.show ? 'flex' : 'none' }}>
      <div className={`modal`}>
        <div className='header'>{options.header}</div>
        <div className='body'>{options.body}</div>
        <div className='foot'>
          {options?.buttons?.map((btn, i) => {
            return (
              <button key={'btn' + i} {...btn.props}>
                {btn.innerText}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.getElementById('portal')
  );
}
