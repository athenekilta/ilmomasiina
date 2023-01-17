# `createStateContext`

The public side of the frontend uses some state management utilities built on `useContext`.

It's mostly contained in one short file,
[stateContext.tsx](../packages/ilmomasiina-frontend/src/utils/stateContext.tsx).

## State

The state for each view is separated under `modules/{RouteName}/`.

Views keep most of their mutable state local and only use `createStateContext` for initial loading. All that is is a
wrapper for the common boilerplate of creating a context and wrapping `useContext` for it, along with disallowing usage
outside the `Context.Provider`.

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

## Thunk actions

For performing more e.g. API requests based on state, `createStateContext` returns the `createThunk` function.
`createThunk` takes a function similar to `redux-thunk` thunks, only the nested functions are in reverse order:

```ts
const useSomeAction = createThunk((state) => (actionArg: string) => {
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
