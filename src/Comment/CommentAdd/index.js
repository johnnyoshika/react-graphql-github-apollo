import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import ErrorMessage from '../../Error';

import ISSUECOMMENT_FRAGMENT from '../fragment';
import { GET_COMMENTS_OF_ISSUE } from '../CommentList/queries';

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

const updateComments = ({
    repositoryOwner,
    repositoryName,
    issue
  },
  client,
  {
    data: {
      addComment: {
        commentEdge
      }
    }
  }
) => {
  const data = client.readQuery({
    query: GET_COMMENTS_OF_ISSUE,
    variables: {
      repositoryOwner,
      repositoryName,
      issueNumber: issue.number
    }
  });
  
  client.writeQuery({
    query: GET_COMMENTS_OF_ISSUE,
    variables: {
      repositoryOwner,
      repositoryName,
      issueNumber: issue.number
    },
    data: {
      ...data,
      repository: {
        ...data.repository,
        issue: {
          ...data.repository.issue,
          comments: {
            ...data.repository.issue.comments,
            edges: [
              ...data.repository.issue.comments.edges,
              commentEdge
            ]
          }
        }
      }
    }
  })
};

const CommentAdd = ({
  issue,
  repositoryOwner,
  repositoryName
}) =>  {
  const [value, setValue] = useState('');
  const onChange = event => setValue(event.target.value);
  const onSubmit = (event, addComment) => {
    event.preventDefault();
    addComment().then(() => setValue(''));
  };
  const [addComment, { error }] = useMutation(ADD_COMMENT, {
    variables: {
      subjectId: issue.id,
      body: value
    },
    optimisticResponse: {
      addComment: {
        __typename: 'Mutation',
        commentEdge: {
          __typename: 'IssueCommentEdge',
          node: {
            __typename: 'IssueComment',
            id: new Date().getTime() + '',
            databaseId: new Date().getTime(),
            author: {
              __typename: 'User',
              login: 'me'
            },
            bodyHTML: value
          }
        }
      }
    },
    update: (client, data) => updateComments({
      repositoryOwner,
      repositoryName,
      issue
    }, client, data)
  });

  return (
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
  );
};

export default CommentAdd;