import { useEffect, useState } from 'react';

/** Returns an AbortSignal and a function that aborts the signal. */
export function abortable(): [AbortSignal, () => void] {
  const controller = new AbortController();
  const abort = () => controller.abort();
  return [controller.signal, abort];
}

/** Like useEffect, but instead of accepting a cleanup function, provides an AbortSignal that is aborted
 * upon unmount or deps change.
 */
export function useAbortableEffect(effect: (signal: AbortSignal) => void, deps?: any[]) {
  useEffect(() => {
    const [signal, abort] = abortable();
    effect(signal);
    return abort;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export type PromiseState<R> = {
  result: undefined;
  error: false;
  pending: true;
} | {
  result: R;
  error: false;
  pending: false;
} | {
  result: undefined;
  error: true;
  pending: false;
};

/** Wraps a Promise, ignoring DOMExceptions with name='AbortError' as if the promise was left pending. */
export function ignoreAbort<R>(promise: Promise<R>): Promise<R> {
  return new Promise((resolve, reject) => {
    promise.then(resolve, (error) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      reject(error);
    });
  });
}

/** Returns the state of an async effect, and provides to it an AbortSignal that is aborted
 * upon unmount or deps change.
 *
 * DOMExceptions with name='AbortError' are ignored, as if the promise was left pending.
 * Unmounting or deps changes also return the state to pending.
 */
export function useAbortablePromise<R>(effect: (signal: AbortSignal) => Promise<R>, deps?: any[]) {
  const [state, setState] = useState<PromiseState<R>>({
    result: undefined,
    error: false,
    pending: true,
  });
  useAbortableEffect((signal) => {
    ignoreAbort(effect(signal)).then(
      (result) => setState({
        result,
        error: false,
        pending: false,
      }),
      () => setState({
        result: undefined,
        error: true,
        pending: false,
      }),
    );
    signal.addEventListener('abort', () => setState({
      result: undefined,
      error: false,
      pending: true,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}
