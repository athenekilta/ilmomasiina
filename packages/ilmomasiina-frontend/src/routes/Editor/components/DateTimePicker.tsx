import React from 'react';

import fi from 'date-fns/locale/fi';
import { useField } from 'formik';
import DatePicker, { registerLocale } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

registerLocale('fi', fi);

type Props = {
  name: string;
};

export default function DateTimePicker({ name }: Props) {
  const [{ value, onBlur }, , { setValue }] = useField(name);
  return (
    <DatePicker
      name={name}
      selected={value}
      showTimeSelect
      showWeekNumbers
      className="form-control"
      isClearable
      showPopperArrow={false}
      dateFormat="dd.MM.yyyy HH:mm"
      timeFormat="HH:mm"
      locale="fi"
      timeCaption="Aika"
      onBlur={onBlur}
      onChange={(newValue) => setValue(newValue)}
    />
  );
}
