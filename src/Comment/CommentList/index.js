import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import FetchMore from '../../FetchMore';
import CommentItem from '../CommentItem';
import CommentAdd from '../CommentAdd';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';

import { GET_COMMENTS_OF_ISSUE } from './queries';

import './style.css';


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

const Comments = ({ repositoryOwner, repositoryName, issue }) => {
  const { data, loading, error, fetchMore } = useQuery(GET_COMMENTS_OF_ISSUE, {
    variables: {
      repositoryOwner,
      repositoryName,
      issueNumber: issue.number
    },
    notifyOnNetworkStatusChange: true
  });

  if (error) return <ErrorMessage error={error} />;
            
  if (loading && !data) return <Loading />;

  if (!data.repository.issue.comments.edges.length) return <div className="CommentList">No comments ...</div>;

  const { repository: { issue: { comments } } } = data;

  return (
    <>
      <CommentList
        issue={issue}
        comments={comments}
        loading={loading}
        fetchMore={fetchMore}
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
      />
      <CommentAdd
        issue={issue}
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
      />
    </>
  );
};

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