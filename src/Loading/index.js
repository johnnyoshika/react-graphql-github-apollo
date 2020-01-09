import React, { useState, useEffect } from 'react';

import './style.css';

const TICK_RATE = 500;

export default ({ isCenter }) => {
  const [dots, setDots] = useState(0);

  const onTick = () => setDots(dots => dots + 1);

  useEffect(() => {
    const interval = setInterval(onTick, TICK_RATE);
    return () => clearInterval(interval);
  }, []);

  const classNames = ['Loading'];
  if (isCenter) classNames.push('Loading_center');

  return <div className={classNames.join(' ')}>Loading {new Array(dots % 4).fill(0).map(dot => '.')}</div>;
};
