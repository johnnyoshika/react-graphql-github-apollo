import React, { useState } from 'react';

import Button from '../../Button';
import Link from '../../Link';
import Comments from '../../Comment';

import './style.css';

const IssueItem = ({ issue, repositoryOwner, repositoryName }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="IssueItem">
      <Button onClick={() => setShowComments(!showComments)}>
        {showComments ? '-' : '+'}
      </Button>

      <div className="IssueItem-content">
        <h3>
          <Link href={issue.url}>{issue.title}</Link>
        </h3>
        <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />

        {showComments && (
          <Comments
            repositoryOwner={repositoryOwner}
            repositoryName={repositoryName}
            issueNumber={issue.number} />
        )}
      </div>
    </div>
  );
}

export default IssueItem;