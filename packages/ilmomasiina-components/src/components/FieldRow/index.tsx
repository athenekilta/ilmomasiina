import React, { ComponentType, ReactNode } from 'react';

import { Field, useFormikContext } from 'formik';
import { Col, Form, Row } from 'react-bootstrap';

import './FieldRow.scss';

type Props = {
  /** The name of the field in the Formik data. */
  name: string;
  /** The label placed in the left column. */
  label?: string;
  /** The help string placed below the field. */
  help?: ReactNode;
  /** Whether the field is required. */
  required?: boolean;
  /** Overrides the real error message if the field has errors. */
  alternateError?: string;
  /** Extra feedback rendered below the field. Bring your own `Form.Control.Feedback`. */
  extraFeedback?: ReactNode;
  /** `true` to adjust the vertical alignment of the left column label for checkboxes/radios. */
  checkAlign?: boolean;
  /** Passed as `label` to the field component. Intended for checkboxes. */
  checkLabel?: ReactNode;
  /** The component or element to use as the field. Passed to Formik's `Field`. */
  as?: ComponentType<any> | string;
  /** If given, this is used as the field. */
  children?: ReactNode;
};

export default function FieldRow<P = unknown>({
  name,
  label = '',
  help,
  required = false,
  alternateError,
  extraFeedback,
  checkAlign,
  checkLabel,
  as = Form.Control,
  children,
  ...props
}: Props & P) {
  const { errors } = useFormikContext<any>();

  let field: ReactNode;
  if (children) {
    field = children;
  } else {
    // Checkboxes have two labels: in the left column and next to the checkbox. Form.Check handles the latter for us
    // and calls it "label", but we still want to call the other one "label" for all other types of field. Therefore
    // we pass "checkLabel" to the field here.
    let fieldProps = props;
    if (checkLabel !== undefined) {
      fieldProps = { ...props, label: checkLabel };
    }
    field = <Field as={as} name={name} required={required} {...fieldProps} />;
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
