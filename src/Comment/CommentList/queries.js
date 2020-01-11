import gql from 'graphql-tag';

import ISSUECOMMENT_FRAGMENT from '../fragment';

export const GET_COMMENTS_OF_ISSUE = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $issueNumber: Int!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issue(number: $issueNumber) {
        id
        comments(first: 3, after: $cursor)
        @connection(key: "comments") {
          edges {
            node {
              ...issueComment
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
  ${ISSUECOMMENT_FRAGMENT}
`;