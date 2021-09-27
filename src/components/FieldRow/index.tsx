import React, { ComponentType, ReactNode } from 'react';

import { Field, useFormikContext } from 'formik';
import { Col, Form, Row } from 'react-bootstrap';

type Props = {
  name: string;
  label: string;
  help?: ReactNode;
  required?: boolean;
  alternateError?: string;
  extraFeedback?: ReactNode;
  checkAlign?: boolean;
  as?: ComponentType<any> | string;
  children?: ReactNode;
};

export default function FieldRow<P = unknown>({
  name,
  label,
  help,
  required = false,
  alternateError,
  extraFeedback,
  checkAlign,
  as = Form.Control,
  children,
  ...props
}: Props & P) {
  const { errors } = useFormikContext<any>();

  let field: ReactNode;
  if (children) {
    field = children;
  } else {
    field = <Field as={as} name={name} required={required} {...props} />;
  }

  return (
    <Form.Group as={Row} controlId={name}>
      <Form.Label column sm="3" data-required={required} className={checkAlign ? 'pt-0' : ''}>{label}</Form.Label>
      <Col sm="9">
        {field}
        <Form.Control.Feedback type="invalid">
          {errors[name] && (alternateError || errors[name])}
        </Form.Control.Feedback>
        {extraFeedback}
        {help && <Form.Text muted>{help}</Form.Text>}
      </Col>
    </Form.Group>
  );
}
