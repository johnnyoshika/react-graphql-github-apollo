import React, { useState } from 'react';
import { ApolloConsumer } from 'react-apollo';

import Button from '../../Button';
import Link from '../../Link';
import Comments from '../../Comment';

import { GET_COMMENTS_OF_ISSUE } from '../../Comment/CommentList/queries';

import './style.css';

const prefetchComments = (
  client,
  repositoryOwner,
  repositoryName,
  issueNumber
) => client.query({
  query: GET_COMMENTS_OF_ISSUE,
  variables: {
    repositoryOwner,
    repositoryName,
    issueNumber
  }
});

const IssueItem = ({ issue, repositoryOwner, repositoryName }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="IssueItem">
      <CommentsToggle
        showComments={showComments}
        setShowComments={setShowComments}
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
        issueNumber={issue.number}
      />

      <div className="IssueItem-content">
        <h3>
          <Link href={issue.url}>{issue.title}</Link>
        </h3>
        <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />

        {showComments && (
          <Comments
            repositoryOwner={repositoryOwner}
            repositoryName={repositoryName}
            issue={issue} />
        )}
      </div>
    </div>
  );
};

const CommentsToggle = ({
  showComments,
  setShowComments,
  repositoryOwner,
  repositoryName,
  issueNumber
}) => (
  <ApolloConsumer>
    {client => (
      <Button
        onClick={() => setShowComments(!showComments)}
        onMouseOver={() => prefetchComments(
          client,
          repositoryOwner,
          repositoryName,
          issueNumber
        )}
      >
        {showComments ? '-' : '+'}
      </Button>
    )}
  </ApolloConsumer>
);

export default IssueItem;