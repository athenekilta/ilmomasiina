import React, { ReactNode } from 'react';

import { Col, Row } from 'react-bootstrap';

type Props = {
  children: ReactNode;
  className?: string;
};

const NarrowContainer = ({ children, className = '' }: Props) => (
  <Row className={`justify-content-md-center ${className}`}>
    <Col xs="12" md="10" lg="8">
      {children}
    </Col>
  </Row>
);

export default NarrowContainer;
