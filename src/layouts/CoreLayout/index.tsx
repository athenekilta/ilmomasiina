import React, { ReactNode } from 'react';

import Footer from '../../components/Footer';
import Header from '../../components/Header';

import './CoreLayout.scss';
import '../../styles/core.scss';

type Props = {
  children: ReactNode;
};

const CoreLayout = ({ children }: Props) => (
  <div className="layout-wrapper">
    <Header />
    <div className="page-wrapper">{children}</div>
    <Footer />
  </div>
);

export default CoreLayout;
