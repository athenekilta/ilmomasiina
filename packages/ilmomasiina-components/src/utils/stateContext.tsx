import React, {
  createContext, Dispatch, ReactNode, Reducer, useContext, useMemo, useReducer,
} from 'react';

const MISSING = Symbol('missing');

/** Creates a React context and an associated hook that only works inside the Provider. */
export function createStateContext<State>() {
  const Context = createContext<State | typeof MISSING>(MISSING);

  /** React hook that fetches the state via a context. */
  function useStateContext() {
    const context = useContext(Context);
    if (context === MISSING) throw new Error('useStateContext used outside corresponding Provider');
    return context;
  }

  return {
    Context,
    Provider: Context.Provider,
    useStateContext,
  };
}

/** Creates a React context that carries reducer-backed state, externally provided state,
 * as well as the reducer dispatch function.
 */
export function createReducerContext<ReducerState, Actions, ExternalState = undefined>(
  reducer: Reducer<ReducerState, Actions>,
  initialState: ReducerState,
) {
  type State = ReducerState & ExternalState;
  type ContextValue = readonly [State, Dispatch<Actions>];

  const { Context, useStateContext } = createStateContext<ContextValue>();

  type ProviderProps = {
    children?: ReactNode;
    state: ExternalState;
  };

  /** React component that provides state and dispatch via a context. */
  function Provider({ children, state }: ProviderProps) {
    const [reducerState, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => ([
      {
        ...reducerState,
        ...state,
      },
      dispatch,
    ] as const), [reducerState, state, dispatch]);

    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  }

  /** Wraps a function into a React hook that provides it with state and dispatch. */
  function createThunk<A extends any[], R>(action: (state: State, dispatch: Dispatch<Actions>) => (...args: A) => R) {
    return () => {
      const [state, dispatch] = useStateContext();
      return action(state, dispatch);
    };
  }

  return {
    useStateAndDispatch: useStateContext,
    createThunk,
    Context,
    Provider,
  };
}
