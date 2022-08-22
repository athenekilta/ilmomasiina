import React, { AnchorHTMLAttributes, ComponentType } from 'react';

/** <Link> props that aim to be compatible with multiple routers, including `react-router-dom`, `@reach/router`
 * and `gatsby`.
 */
export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  /* eslint-disable-next-line react/no-unused-prop-types */
  replace?: boolean;
}

/** <Link> component definition that aims to be compatible with multiple routers, including `react-router-dom`,
 * `@reach/router` and `gatsby`.
 */
export type LinkComponent = ComponentType<LinkProps>;

/** useParams() definition that aims to be compatible with multiple routers, including `react-router-dom`,
 * `@reach/router` and `gatsby`.
 */
export type UseParamsHook = <T extends {}>() => T;

/** useNavigate() definition that aims to be compatible with multiple routers, including `react-router-dom`,
 * `@reach/router` and `gatsby`.
 */
export type UseNavigateHook = () => (to: string, options?: { replace?: boolean }) => void;

export interface RouterConfig {
  Link: LinkComponent;
  useParams: UseParamsHook;
  useNavigate: UseNavigateHook;
}

/** Barebones implementation of LinkComponent. */
function DefaultLink({ to, children }: LinkProps) {
  return <a href={to}>{children}</a>;
}

/** Barebones implementation of a router. */
let config: RouterConfig = {
  Link: DefaultLink,
  useParams: () => {
    throw new Error('useParams not configured');
  },
  useNavigate: () => (url) => {
    window.location.href = url;
  },
};

export function configureRouter(newConfig: RouterConfig) {
  config = newConfig;
}

export function linkComponent() {
  return config.Link;
}

export function useParams<T extends {}>(): T {
  return config.useParams<T>();
}

export function useNavigate() {
  return config.useNavigate();
}
