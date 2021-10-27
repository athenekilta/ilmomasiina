import React from 'react';

import { DatePicker, TimePicker } from 'antd';
import { useField } from 'formik';

import 'antd/lib/input/style/index.css';
import 'antd/lib/date-picker/style/index.css';
import 'antd/lib/time-picker/style/index.css';
import './slide.scss';

type Props = {
  name: string;
  required?: boolean;
};

export default function DateTimePicker({
  name, required = false,
}: Props) {
  const [{ onBlur, value }, , { setValue }] = useField({ name, required });

  return (
    <>
      <DatePicker
        id={`${name}-date`}
        format="DD.MM.YYYY"
        value={value}
        onChange={(date) => setValue(date || undefined)}
        onBlur={onBlur}
      />
      <TimePicker
        id={`${name}-time`}
        minuteStep={5}
        format="HH.mm"
        value={value}
        onChange={(date) => setValue(date || undefined)}
        onBlur={onBlur}
      />
    </>
  );
}
