import React from 'react';

import { DatePicker, TimePicker } from 'antd';
import moment from 'moment-timezone';

import 'antd/lib/input/style/index.css';
import 'antd/lib/date-picker/style/index.css';
import 'antd/lib/time-picker/style/index.css';

type Props = {
  label?: string;
  name: string;
  value: string;
  updateEventField: any;
};

const DateTimePicker = (props: Props) => {
  const { label, name, value, updateEventField } = props;

  return (
    <div className="form-group row">
      {label && (
        <label className="control-label col-sm-3" data-required="false">
          {label}
        </label>
      )}
      <div className="col-sm-9">
        <DatePicker
          format="DD.MM.YYYY"
          onChange={time => updateEventField(name, time.toDate())}
          value={moment(value)}
        />
        <TimePicker
          minuteStep={5}
          format="HH.mm"
          onChange={time => updateEventField(name, time.toDate())}
          value={moment(value)}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
