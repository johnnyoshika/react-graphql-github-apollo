import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
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
        stargazers {
          totalCount
        }
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
        stargazers {
          totalCount
        }
      }
    }
  }
`;

const WATCH_REPOSITORY = gql`
  mutation ($id: ID!, $viewerSubscription: SubscriptionState!) {
    updateSubscription(
      input: { state: $viewerSubscription, subscribableId: $id }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

const isWatch = viewerSubscription =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateWatch = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: { id, viewerSubscription }
      }
    }
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT
  });

  let { totalCount } = repository.watchers;
  totalCount = viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED ? totalCount + 1 : totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount
      }
    }
  });
};

const RepositoryItem = ({
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
}) => {
  const [addStar] = useMutation(ADD_STAR, {
    variables: { id },
    optimisticResponse: {
      addStar: {
        __typename: 'AddStarPayload',
        starrable: {
          __typename: 'Repository',
          id,
          viewerHasStarred: true,
          stargazers: {
            __typename: 'StargazerConnection',
            totalCount: stargazers.totalCount + 1
          }
        }
      }
    }
  });

  const [removeStar] = useMutation(REMOVE_STAR, {
    variables: { id },
    optimisticResponse: {
      removeStar: {
        __typename: 'RemoveStarPayload',
        starrable: {
          __typename: 'Repository',
          id,
          viewerHasStarred: false,
          stargazers: {
            __typename: 'StargazerConnection',
            totalCount: stargazers.totalCount - 1
          }
        }
      }
    }
  });

  const [updateSubscription] = useMutation(WATCH_REPOSITORY, {
    variables: {
      id,
      viewerSubscription: isWatch(viewerSubscription)
        ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
        : VIEWER_SUBSCRIPTIONS.SUBSCRIBED
    },
    optimisticResponse: {
      updateSubscription: {
        __typename: 'UpdateSubscriptionPayload',
        subscribable: {
          __typename: 'Repository',
          id,
          viewerSubscription: isWatch(viewerSubscription)
            ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
            : VIEWER_SUBSCRIPTIONS.SUBSCRIBED
        }
      }
    },
    update: updateWatch
  });

  return (
    <div>
      <div className="RepositoryItem-title">
        <h2>
          <Link href={url}>{name}</Link>
        </h2>

        <div>
          {!viewerHasStarred ? (
            <Button className={'RepositoryItem-title-action'} onClick={addStar}>
              {stargazers.totalCount} Star
            </Button>
          ) : (
            <Button className={'RepositoryItem-title-action'} onClick={removeStar}>
              {stargazers.totalCount} Unstar
            </Button>
          )}

          <Button className="RepositoryItem-title-action" onClick={updateSubscription}>
            {watchers.totalCount}{' '}
            {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
          </Button>
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
};

export default RepositoryItem;