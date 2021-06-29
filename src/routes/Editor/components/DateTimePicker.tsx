import React from 'react';

import { DatePicker, TimePicker } from 'antd';
import { useField } from 'formik';
import moment from 'moment';
import { Form, Row } from 'react-bootstrap';

import 'antd/lib/input/style/index.css';
import 'antd/lib/date-picker/style/index.css';
import 'antd/lib/time-picker/style/index.css';

type Props = {
  name: string;
  label?: string;
  required?: boolean;
};

export default function DateTimePicker({
  name, label, required = false,
}: Props) {
  const [{ onBlur, onChange, value }, { error }] = useField({ name, required });

  return (
    <Form.Group as={Row}>
      {label && (
        <Form.Label className="control-label col-sm-3" data-required="false" htmlFor={`${name}-date`}>
          {label}
        </Form.Label>
      )}
      <div className="col-sm-9">
        <DatePicker
          id={`${name}-date`}
          format="DD.MM.YYYY"
          value={moment(value)}
          onChange={(date) => onChange(date?.toDate().toISOString())}
          onBlur={onBlur}
        />
        <TimePicker
          id={`${name}-time`}
          minuteStep={5}
          format="HH.mm"
          value={moment(value)}
          onChange={(date) => onChange(date?.toDate().toISOString())}
          onBlur={onBlur}
        />
        <span className="text-invalid">
          {error && '* Tämä kenttä vaaditaan.'}
        </span>
      </div>
    </Form.Group>
  );
}
