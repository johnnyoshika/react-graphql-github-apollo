import gql from 'graphql-tag';

export default gql`
  fragment issue on Issue {
    id
    number
    state
    title
    url
    bodyHTML
  }
`;