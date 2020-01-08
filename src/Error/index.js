import React from 'react';

import './style.css';

export default ({ error }) => (
  <div className="ErrorMessage">
    <small>{error.toString()}</small>
  </div>
);