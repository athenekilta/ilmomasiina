import React from 'react';

import { FieldInputProps, useField } from 'formik';
import Combobox from 'react-widgets/Combobox';

import './Autocomplete.scss';

type Props = FieldInputProps<string> & {
  options: string[];
};

export default function Autocomplete({
  name,
  value,
  options,
  onChange,
  ...props
}: Props) {
  const [, , { setValue }] = useField(name);
  return (
    <Combobox
      id={name}
      data={options}
      value={value}
      onChange={(newVal) => setValue(newVal)}
      {...props}
    />
  );
}
