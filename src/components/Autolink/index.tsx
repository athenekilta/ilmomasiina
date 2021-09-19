import React, { ReactNode } from 'react';

import Linkify from 'react-linkify';

const makeLink = (decoratedHref: string, decoratedText: string, key: number) => (
  <a key={key} href={decoratedHref} target="_blank" rel="noreferrer noopener">
    {decoratedText}
  </a>
);

type Props = {
  children: ReactNode;
};

const Autolink = ({ children }: Props) => (
  <Linkify componentDecorator={makeLink}>
    {children}
  </Linkify>
);

export default Autolink;
