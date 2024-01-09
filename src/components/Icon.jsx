import React from 'react';

export default function Icon({ className, style, src, ...rest }) {
  /*  --icon-src: '';
    mask-image: url(var\(--icon-src\));
    mask-repeat: cover;
    -webkit-mask-image: url(var\(--icon-src\));
    -webkit-mask-repeat: cover; */
  const _className = 'icon' + (className ? ' ' + className : '');
  const _style = {
    ...style,
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
  };

  return <div className={_className} style={_style} {...rest} />;
}
