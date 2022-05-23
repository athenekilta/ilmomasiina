import React, { ComponentPropsWithoutRef } from 'react';

import fi from 'date-fns/locale/fi';
import { useField } from 'formik';
import DatePicker, { registerLocale } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

registerLocale('fi', fi);

type Props = Pick<
ComponentPropsWithoutRef<typeof DatePicker>,
'selectsStart' | 'selectsEnd' | 'startDate' | 'endDate'
> & {
  name: string;
};

export default function DateTimePicker({
  name, selectsStart, selectsEnd, startDate, endDate,
}: Props) {
  const [{ value, onBlur }, , { setValue }] = useField(name);
  return (
    <DatePicker
      name={name}
      selected={value}
      startDate={selectsStart ? value : startDate}
      endDate={selectsEnd ? value : endDate}
      selectsStart={selectsStart}
      selectsEnd={selectsEnd}
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
