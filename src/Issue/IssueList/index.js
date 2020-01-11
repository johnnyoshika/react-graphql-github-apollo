import React, { useState } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import { ButtonUnobtrusive } from '../../Button';

import './style.css';

import ISSUE_FRAGMENT from '../fragment';

const GET_ISSUES_OF_REPOSITORY = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $issueState: IssueState!
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, states: [$issueState]) {
        edges {
          node {
            ...issue
          }
        }
      }
    }
  }
  ${ISSUE_FRAGMENT}
`;

const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: 'Show Open Issues',
  [ISSUE_STATES.OPEN]: 'Show Closed Issues',
  [ISSUE_STATES.CLOSED]: 'Hide Issues',
};
const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

const prefetchIssues = (
  client,
  repositoryOwner,
  repositoryName,
  issueState
) => {
  const nextIssueState = TRANSITION_STATE[issueState];
  if (isShow(nextIssueState))
    client.query({
      query: GET_ISSUES_OF_REPOSITORY,
      variables: {
        repositoryOwner,
        repositoryName,
        issueState: nextIssueState
      }
    });
};

const Issues = ({ repositoryOwner, repositoryName }) => {
  const [issueState, setIssueState] = useState(ISSUE_STATES.NONE);

  return (
    <div className="Issues">
      <IssueFilter
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
        issueState={issueState}
        onChangeIssueState={setIssueState} />

      {isShow(issueState) && (
        <IssueList issueState={issueState} repositoryOwner={repositoryOwner} repositoryName={repositoryName} />
      )}
      </div>
  );
}

const IssueFilter = ({
  repositoryOwner,
  repositoryName,
  issueState,
  onChangeIssueState
}) => {
  const client = useApolloClient();
  
  return (
    <ButtonUnobtrusive
      onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
      onMouseOver={() => prefetchIssues(
        client,
        repositoryOwner,
        repositoryName,
        issueState
      )}
    >
      {TRANSITION_LABELS[issueState]}
    </ButtonUnobtrusive>
  );
};

const IssueList = ({ issueState, repositoryOwner, repositoryName }) => {
  const { data, loading, error } = useQuery(GET_ISSUES_OF_REPOSITORY, {
    variables: {
      repositoryOwner,
      repositoryName,
      issueState
    },
    notifyOnNetworkStatusChange: true
  });

  if (error) return <ErrorMessage error={error} />;
  
  if (loading) return <Loading />;

  const { repository } = data;
  if (!repository) return <Loading />;

  if (!repository.issues.edges.length) return <div className="IssueList">No issues ...</div>;

  return (
    <div className="IssueList">
      {repository.issues.edges.map(({ node }) => (
        <IssueItem key={node.id} issue={node} repositoryOwner={repositoryOwner} repositoryName={repositoryName} />
      ))}
    </div>
  );
};

export default Issues;