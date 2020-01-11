import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';
import Loading from '../Loading';
import ErrorMessage from '../Error';

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  query($cursor:String) {
    viewer {
      repositories(
        first: 5,
        orderBy: {direction: DESC, field: STARGAZERS}
        after: $cursor
      ) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  ${REPOSITORY_FRAGMENT}
`;

// Set notifyOnNetworkStatusChange to true to update `loading` on subsequent requests
const Profile = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_REPOSITORIES_OF_CURRENT_USER, {
    notifyOnNetworkStatusChange: true
  });

  if (error) return <ErrorMessage error={error} />;

  if (loading && !data) return <Loading isCenter={true} />;

  const { viewer } = data;
  if (!viewer) return <Loading isCenter={true} />;

  return <RepositoryList
    repositories={viewer.repositories}
    loading={loading}
    fetchMore={fetchMore}
    entry="viewer"
  />;
};

export default Profile;