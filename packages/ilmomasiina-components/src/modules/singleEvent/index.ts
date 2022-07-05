import { useMemo } from 'react';

import { Event } from '@tietokilta/ilmomasiina-models/src/services/events';
import apiFetch from '../../../api';
import { useAbortablePromise } from '../../../utils/abortable';
import { getSignupsByQuota, QuotaSignups } from '../../../utils/signupUtils';
import { createStateContext } from '../../../utils/stateContext';
import useShallowMemo from '../../../utils/useShallowMemo';
import { MatchParams } from '..';

type State = {
  event?: Event.Details;
  signupsByQuota?: QuotaSignups[];
  pending: boolean;
  error: boolean;
};

const { Provider, useStateContext } = createStateContext<State>();
export { Provider as SingleEventProvider, useStateContext as useSingleEventContext };

export function useSingleEventState({ slug }: MatchParams) {
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
