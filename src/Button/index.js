import React from 'react';

import './style.css';

export default ({
  children,
  className,
  color = 'black',
  type = 'button',
  ...props
}) =>  (
  <button className={`${className} Button Button_${color}`} type={type} {...props}>
    {children}
  </button>
);