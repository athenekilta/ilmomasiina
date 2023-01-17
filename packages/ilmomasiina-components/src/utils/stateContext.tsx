import { createContext, useContext } from 'react';

export const MISSING = Symbol('missing');

/** Creates a React context and an associated hook that only works inside the Provider. */
export function createStateContext<State>() {
  const Context = createContext<State | typeof MISSING>(MISSING);

  /** React hook that fetches the state via a context. */
  function useStateContext() {
    const context = useContext(Context);
    if (context === MISSING) throw new Error('useStateContext used outside corresponding Provider');
    return context;
  }

  /** Wraps a function into a React hook that provides it with state. */
  function createThunk<A extends any[], R>(action: (state: State) => (...args: A) => R) {
    return () => {
      const state = useStateContext();
      return action(state);
    };
  }

  return {
    Context,
    Provider: Context.Provider,
    useStateContext,
    createThunk,
  };
}
