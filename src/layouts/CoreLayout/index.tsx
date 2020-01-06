import React from "react";

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Footer from "../../components/Footer";
import Header from "../../components/Header";

import "./CoreLayout.scss";
import "../../styles/core.scss";

const CoreLayout: React.FC = ({ children }) => (
  <div className="layout-wrapper">
    <Header />
    <div className="page-wrapper">{children}</div>
    <Footer />
  </div>
);

CoreLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default withRouter(CoreLayout);
