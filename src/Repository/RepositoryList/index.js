import React from 'react';
import RepositoryItem from '../RepositoryItem';

import '../style.css';

export default function({ repositories }) {
  return (
    repositories.edges.map(({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />
      </div>
    ))
  );
}
