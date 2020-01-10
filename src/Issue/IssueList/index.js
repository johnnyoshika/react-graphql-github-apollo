import React, { useState } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import { ButtonUnobtrusive } from '../../Button';

import './style.css';

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
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
      }
    }
  }
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

const Issues = ({ repositoryOwner, repositoryName }) => {
  const [issueState, setIssueState] = useState(ISSUE_STATES.NONE);

  return (
    <div className="Issues">
      <IssueFilter issueState={issueState} onChangeIssueState={setIssueState} />
      {isShow(issueState) && (
        <Query
          query={GET_ISSUES_OF_REPOSITORY}
          variables={{
            repositoryOwner,
            repositoryName,
            issueState
          }}
        >
          {( { data, loading, error }) => {
            if (error) return <ErrorMessage error={error} />;
  
            if (loading && !data) return <Loading />;
  
            const { repository } = data;
            if (!repository) return <Loading />;
  
            if (!repository.issues.edges.length) return <div className="IssueList">No issues ...</div>;
  
            return <IssueList issues={repository.issues} />;
          }}
        </Query>
      )}
      </div>
  );
}

const IssueFilter = ({ issueState, onChangeIssueState }) => (
  <ButtonUnobtrusive onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}>
    {TRANSITION_LABELS[issueState]}
  </ButtonUnobtrusive>
);

const IssueList = ({ issues }) => (
  <div className="IssueList">
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} />
    ))}
  </div>
);

export default Issues;