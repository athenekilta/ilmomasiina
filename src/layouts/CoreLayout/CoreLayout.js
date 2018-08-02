import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './CoreLayout.scss';
import '../../styles/core.scss';

export const CoreLayout = ({ children }) => (
  <div className="layout-wrapper">
    <Header />
    <div className="page-wrapper">
      {children}
    </div>
    <Footer />
  </div>
);

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default CoreLayout;
