import React from 'react';

import { Form, FormControlProps } from 'react-bootstrap';

type SelectOptions = [string, string][];

type Props = FormControlProps & {
  options: SelectOptions;
};

const SelectBox = ({ options, ...props }: Props) => (
  <Form.Control as="select" {...props}>
    {options.map(([value, label]) => (
      <option value={value}>{label}</option>
    ))}
  </Form.Control>
);

export default SelectBox;
