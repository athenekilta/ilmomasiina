import React, { PropsWithChildren, useMemo } from 'react';

import { Event } from '@tietokilta/ilmomasiina-models';
import apiFetch from '../../api';
import { useAbortablePromise } from '../../utils/abortable';
import { getSignupsByQuota, QuotaSignups } from '../../utils/signupUtils';
import { createStateContext } from '../../utils/stateContext';
import useShallowMemo from '../../utils/useShallowMemo';

export interface SingleEventProps {
  slug: string;
}

type State = {
  event?: Event.Details;
  signupsByQuota?: QuotaSignups[];
  pending: boolean;
  error: boolean;
};

const { Provider, useStateContext } = createStateContext<State>();
export { useStateContext as useSingleEventContext };

export function useSingleEventState({ slug }: SingleEventProps) {
  const fetchEvent = useAbortablePromise(async (signal) => (
    await apiFetch(`events/${slug}`, { signal }) as Event.Details
  ), [slug]);

  const event = fetchEvent.result;

  const signupsByQuota = useMemo(() => event && getSignupsByQuota(event), [event]);

  return useShallowMemo<State>({
    event,
    signupsByQuota,
    pending: fetchEvent.pending,
    error: fetchEvent.error,
  });
}

export function SingleEventProvider({ slug, children }: PropsWithChildren<SingleEventProps>) {
  const state = useSingleEventState({ slug });
  return (
    <Provider value={state}>
      {children}
    </Provider>
  );
}
