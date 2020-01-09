import React from 'react';

import './style.css';

export default ({ isCenter }) => {
  const classNames = ['Loading'];
  if (isCenter) classNames.push('Loading_center');

  return <div className={classNames.join(' ')}>Loading...</div>;
};
