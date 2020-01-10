import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import FetchMore from '../../FetchMore';
import CommentItem from '../CommentItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';

import './style.css';

const GET_COMMENTS_OF_ISSUE = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $issueNumber: Int!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issue(number: $issueNumber) {
        id
        comments(first: 3, after: $cursor) {
          edges {
            node {
              id
              bodyHTML
              author {
                login
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult)
    return previousResult;

  return {
    ...previousResult,
    repository: {
      ...previousResult.repository,
      issue: {
        ...previousResult.repository.issue,
        ...fetchMoreResult.repository.issue,
        comments: {
          ...previousResult.repository.issue.comments,
          ...fetchMoreResult.repository.issue.comments,
          edges: [
            ...previousResult.repository.issue.comments.edges,
            ...fetchMoreResult.repository.issue.comments.edges
          ]
        }
      }
    }
  };
};

const Comments = ({ repositoryOwner, repositoryName, issueNumber }) => (
  <Query
    query={GET_COMMENTS_OF_ISSUE}
    variables={{
      repositoryOwner,
      repositoryName,
      issueNumber
    }}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      if (error) return <ErrorMessage error={error} />;
        
      if (loading && !data) return <Loading />;

      if (!data.repository.issue.comments.edges.length) return <div className="CommentList">No comments ...</div>;

      const { repository: { issue: { comments } } } = data;

      return <CommentList
        comments={comments}
        loading={loading}
        fetchMore={fetchMore} />;
    }}
  </Query>
);

const CommentList = ({
  comments,
  loading,
  fetchMore
}) => (
  <div className="CommentList">
    {comments.edges.map(({ node }) => (
      <CommentItem key={node.id} comment={node} />
    ))}

    <FetchMore
      loading={loading}
      hasNextPage={comments.pageInfo.hasNextPage}
      variables={{
        cursor: comments.pageInfo.endCursor
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Comments
    </FetchMore>
  </div>
);

export default Comments;