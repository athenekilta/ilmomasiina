# `create{State,Reducer}Context`

The public side of the frontend has a slightly weird state management system built on `useReducer` and `useContext`.
In one sentence, it's a `useReducer` wrapper with some convenience added.

It's mostly contained in one short file,
[stateContext.tsx](../packages/ilmomasiina-frontend/src/utils/stateContext.tsx). The system is pretty simple and
should be easy to learn for anyone familiar with reducers.

## Why?

TL;DR: I wasn't happy with any existing solutions, and the code is cleaner.

- The main reason for the change is **embeddability**. Redux, which we used previously, puts everything in a global,
  shared store, which means that our public-side views would depend on our entire store typings (and in turn on the
  dependencies of our admin stuff).
- Now, we could solve this by creating two root reducers/stores, one for the public side and one for the full app. The
  public side would then use typings that only contain its own modules. However, this loses many of the benefits
  Redux has over other solutions, like easy debugging tools.
- Redux also has a lot of boilerplate, especially when fetching data and tracking pending/error states and results
  It also requires one to reset the state when unmounting.
- I considered using Recoil, which allows `<RecoilRoot override>` to create a nested context, but Recoil is ultimately
  also pretty restrictive (state can only be changed via components or Recoil itself) and boilerplate-y in places
  (e.g. explicit view state resets).
- The state we store in Redux doesn't change often. Therefore, we can use this simple context-based solution, and eat
  the slight performance reduction from always re-rendering on any reducer update (which Redux could combat with
  memoized selectors). We can add a `useContextSelector` hook if necessary.

## How?

The state for each view is separated under `modules/{RouteName}/`.

### Simple views

Many views can keep all their mutable state local, and use `createStateContext`. All that is is a wrapper for the
common boilerplate of creating a context and wrapping `useContext` for it, along with disallowing usage outside the
`Context.Provider`.

In a typical view, the returned `useStateContext` hook is re-exported as `use{RouteName}Context`. Then, a
`use{RouteName}State` hook is created to perform initial data fetching, and the main view is wrapped in `Provider`.

```tsx
type State = { /* ... */ };

const { Provider, useStateContext } = createStateContext<State>();
export { Provider as SomeViewProvider, useStateContext as useSomeViewContext };

function useSomeViewState() {
  const state = /* do fetching, call hooks... */;
  return state;
}

export function SomeView({ children }) {
  const state = useSomeViewState();
  return (
    <SomeViewProvider value={state}>
      <ActualViewComponent />{/* uses useSomeViewContext() */}
    </SomeViewProvider>
  );
}
```

### Reducers

Views that need to modify state from the UI use reducers, just like with Redux. This is done via the
`createReducerContext` function.

`createReducerContext` takes the same arguments as `useReducer`: `reducer` and `initialState`. `initialState` is only
the reducer state. (Currently, there is no way to make the initial reducer state depend on props.)

In addition to _reducer state_, the design here also allows the view to augment the state with other data
(_external state_). The reducer and external states are merged, and the context provides the merged state along with
the reducer's dispatch function. If you add external state, you'll need to provide type arguments to
`createReducerContext`.

`createReducerContext` returns the following:
- `Context`: the raw React context that contains `[state, dispatch]`, where `state` is the merged state.
- `useStateAndDispatch`: a `useContext` wrapper for the context.
- `Provider`: a component that takes _external state_ and provides `Context`.
- `createThunk`: see below.

`createReducerContext` is used exactly like `createStateContext` above, but using the returned `Provider` instead of
`Context.Provider`. The `use{RouteName}State` hook may be omitted if only reducer-based state is used.

```tsx
type ReducerState = { /* ... */ };

type Actions = { type: 'SOME_ACTION' }; /* | ... */

const initialState: ReducerState = { /* ... */ };

type ExternalState = { /* ... */ };

function reducer(state: ReducerState, action: Actions): ReducerState {
  /* ... */
}

const {
  Provider, useStateAndDispatch, createThunk,
} = createReducerContext<ReducerState, Actions, ExternalState>(reducer, initialState);
export { Provider as SomeViewProvider, useStateAndDispatch as useSomeViewContext };

export function SomeView({ children }) {
  const state = useSomeViewExternalState(); // just like useSomeViewState() above
  return (
    <SomeViewProvider state={state}>
      <ActualViewComponent />{/* uses useSomeViewContext() */}
    </SomeViewProvider>
  );
}
```

### Thunk actions

For performing more complex state changes or e.g. API requests based on state, `createReducerContext` returns the
`createThunk` function. `createThunk` takes a function very similar to `redux-thunk` thunks, only the nested functions
are in reverse order:

```ts
const useSomeAction = createThunk((state, dispatch) => (actionArg: string) => {
  // do stuff...
});
```

You can then use `useSomeAction()` in a component to receive your action:

```tsx
const someAction = useSomeAction();

return <button onClick={() => someAction("actionArg")}>;
```

Unlike `redux-thunk`, the action only receives the state at render time, instead of a `getState` function. This means
that the thunk actions are currently not memoized.

### `useShallowMemo`

`useShallowMemo` is a utility hook that can be useful when passing state to `Provider`s and elsewhere. The idea is
that these are equivalent:

```ts
useShallowMemo({
  field1,
  field2,
  field3: someValue,
});

useMemo(() => ({
  field1,
  field2,
  field3: someValue,
}), [
  field1,
  field2,
  someValue,
]);
```

i.e. objects returned are kept reference-equal as long as the objects passed are shallow-equal.
