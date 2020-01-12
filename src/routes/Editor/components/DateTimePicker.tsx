import React from 'react';

import DatePicker from 'antd/lib/date-picker';
import locale from 'antd/lib/date-picker/locale/fi_FI';
import TimePicker from 'antd/lib/time-picker';
import { Input } from 'formsy-react-components';
import moment from 'moment-timezone';

type Props = {
  label: string;
  name: string;
  required: boolean;
  onChange: (field: string, value: any) => void;
  value: any;
};

const DateTimePicker = (props: Props) => {
  const { label, name, required, onChange, value } = props;

  function toMoment(date) {
    return date
      ? moment.tz(date, 'Europe/Helsinki')
      : moment()
          .tz('Europe/Helsinki')
          .hour(0)
          .minute(0)
          .second(0);
  }

  function changeDate(mom) {
    const datetime = toMoment(value)
      .date(mom.date())
      .month(mom.month())
      .year(mom.year());

    onChange(name, datetime.toDate());
  }

  function changeTime(mom) {
    const datetime = toMoment(value)
      .hour(mom.hour())
      .minute(mom.minute());

    onChange(name, datetime.toDate());
  }

  return (
    <div className="form-group row">
      <label className="control-label col-sm-3" data-required="false">
        {label}
        {required ? <span className="required-symbol"> *</span> : null}
      </label>
      <div className="col-sm-9">
        <Input
          type="hidden"
          name={name}
          value={value ? value : ''}
          required={required}
        />
        <DatePicker
          locale={locale}
          format="DD.MM.YYYY"
          onChange={changeDate}
          value={moment(value)}
        />
        <TimePicker
          placeholder="Valitse aika"
          onChange={changeTime}
          minuteStep={5}
          format="HH.mm"
          value={moment(value)}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
