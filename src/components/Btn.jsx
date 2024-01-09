import React from 'react';

export default function Btn({ className, children, ...rest }) {
  return (
    <button className={className ? 'btn ' + className : 'btn'} {...rest}>
      {children}
    </button>
  );
}
