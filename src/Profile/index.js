import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Loading from '../Loading';

const GET_CURRENT_USER = gql`
  {
    viewer {
      login
      name
    }
  }
`;

export default function() {
  return (
    <Query query={GET_CURRENT_USER}>
      {({ data, loading }) => {
        if (loading)
          return <Loading />;

        const { viewer } = data;
        if (!viewer) return null;
        
        return (
          <div>
            {viewer.name} {viewer.login}
          </div>
        );
      }}
    </Query>
  );
}
