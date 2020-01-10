import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import ErrorMessage from '../../Error';

import ISSUECOMMENT_FRAGMENT from '../fragment';

const ADD_COMMENT = gql`
  mutation($subjectId: ID!, $body: String!) {
    addComment(input: { subjectId: $subjectId, body: $body }) {
      commentEdge {
        node {
          ...issueComment
        }
      }
    }
  }
  ${ISSUECOMMENT_FRAGMENT}
`;

const CommentAdd = ({ issue }) =>  {
  const [value, setValue] = useState('');
  const onChange = event => setValue(event.target.value);
  const onSubmit = (event, addComment) => {
    event.preventDefault();
    addComment().then(() => setValue(''));
  };

  return (
    <Mutation
      mutation={ADD_COMMENT}
      variables={{
        subjectId: issue.id,
        body: value
      }}
    >
      {(addComment, { data, loading, error }) => (
        <div>
          {error && <ErrorMessage error={error} />}

          {/* box-sizing https://stackoverflow.com/a/4156343/188740 */}
          <form onSubmit={e => onSubmit(e, addComment)}>
            <textarea
              placeholder="Leave a comment"
              style={{width: '100%', height: '100px', boxSizing: 'border-box'}}
              onChange={onChange} value={value} />
            <div><button style={{width:'100%'}} type="submit">Save</button></div>
          </form>
        </div>
      )}
    </Mutation>
  );
};

export default CommentAdd;