import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import CommentItem from '../CommentItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';

import './style.css';

const GET_COMMENTS_OF_ISSUE = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $issueNumber: Int!
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issue(number: $issueNumber) {
        id
        comments(first: 3) {
          edges {
            node {
              id
              bodyHTML
              author {
                login
              }
            }
          }
        }
      }
    }
  }
`;

const Comments = ({ repositoryOwner, repositoryName, issueNumber }) => (
  <Query
    query={GET_COMMENTS_OF_ISSUE}
    variables={{
      repositoryOwner,
      repositoryName,
      issueNumber
    }}
  >
    {({ data, loading, error }) => {
      if (error) return <ErrorMessage error={error} />;
        
      if (loading && !data) return <Loading />;

      if (!data.repository.issue.comments.edges.length) return <div className="CommentList">No comments ...</div>;

      const { repository: { issue: { comments } } } = data;

      return <CommentList comments={comments} />;
    }}
  </Query>
);

const CommentList = ({ comments }) => (
  <div className="CommentList">
    {comments.edges.map(({ node }) => (
      <CommentItem key={node.id} comment={node} />
    ))}
  </div>
);

export default Comments;