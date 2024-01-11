import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext } from '../contexts/ModalContextProvider';
import Icon from './Icon';

export default function Modal() {
  const [options] = useContext(ModalContext);

  return createPortal(
    <div className='overlay' style={{ display: options.show ? 'flex' : 'none' }}>
      <div className={`modal`}>
        <div className='header'>{options.header}</div>
        <div className='body'>{options.body}</div>
        <div className='foot'>
          {options?.buttons?.map((btn, i) => {
            const { iconProps, innerText, ...btnProps } = btn.props;
            console.log(iconProps, innerText);
            return (
              <button key={'btn' + i} {...btnProps}>
                {iconProps ? <Icon {...iconProps} /> : null}
                {btn.innerText || null}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.getElementById('portal')
  );
}
