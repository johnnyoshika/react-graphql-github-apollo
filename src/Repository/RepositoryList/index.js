import React from 'react';
import RepositoryItem from '../RepositoryItem';

import '../style.css';

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult)
    return previousResult;

  return {
    ...previousResult,
    viewer: {
      ...previousResult.viewer,
      repositories: {
        ...previousResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...previousResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges
        ]
      }
    }
  };
};

export default ({ repositories, fetchMore }) => (
  <>
    {repositories.edges.map(({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />
      </div>
    ))}

    {repositories.pageInfo.hasNextPage && (
      <div style={{textAlign: 'center', margin: '20px'}}>
        <button
          type="button"
          onClick={() => fetchMore({
            variables: {
              cursor: repositories.pageInfo.endCursor
            },
            updateQuery
          })}
        >
        More repositories
        </button>
      </div>
    )}
  </>
);
