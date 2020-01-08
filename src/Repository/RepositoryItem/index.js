import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Link from '../../Link';
import Button from '../../Button';
import REPOSITORY_FRAGMENT from '../fragments';

import '../style.css';

const ADD_STAR = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const REMOVE_STAR = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const updateAddStar = (
  client,
  { data: { addStar: { starrable: { id } } } }
) => updateStarCount(client, id, 1);

const updateRemoveStar = (
  client,
  { data: { removeStar: { starrable: { id } } } }
) => updateStarCount(client, id, -1);

const updateStarCount = (client, id, incrementBy) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT
  });

  const totalCount = repository.stargazers.totalCount + incrementBy;
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount
      }
    }
  });
};

export default({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred
}) => (
  <div>
    <div className="RepositoryItem-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div>
        {!viewerHasStarred ? (
          <Mutation mutation={ADD_STAR} variables={{ id }} update={updateAddStar}>
            {(addStar, { data, loading, error }) => (
              <Button className={'RepositoryItem-title-action'} onClick={addStar}>
                {stargazers.totalCount} Star
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation mutation={REMOVE_STAR} variables={{ id }} update={updateRemoveStar}>
            {(removeStar, { data, loading, error }) => (
              <Button className={'RepositoryItem-title-action'} onClick={removeStar}>
                {stargazers.totalCount} Unstar
              </Button>
            )}
          </Mutation>
        )}

        {/* TODO: updateSubscription mutation */}
      </div>
    </div>

    <div className="RepositoryItem-description">
      <div className="RepositoryItem-description-info" dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
    </div>
    <div className="RepositoryItem-description-details">
      <div>
        {primaryLanguage && (
          <span>Language: {primaryLanguage.name}</span>
        )}
      </div>
      <div>
        {owner && (
          <span>
            Owner: <a href={owner.url}>{owner.login}</a>
          </span>
        )}
      </div>
    </div>
  </div>
);
