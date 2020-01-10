import React from 'react';

import './style.css';

const CommentItem = ({ comment }) => (
  <div className="CommentItem">
    <div>{comment.author.login}:</div>
    &nbsp;
    <div dangerouslySetInnerHTML={{ __html: comment.bodyHTML }} />
  </div>
);

export default CommentItem;
