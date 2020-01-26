import React from 'react';

import DatePicker from 'antd/lib/date-picker';
import locale from 'antd/lib/date-picker/locale/fi_FI';
import TimePicker from 'antd/lib/time-picker';
import moment from 'moment-timezone';

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
          locale={locale}
          format="DD.MM.YYYY"
          onChange={time => updateEventField(name, time.toDate())}
          value={moment(value)}
        />
        <TimePicker
          placeholder="Valitse aika"
          onChange={time => updateEventField(name, time.toDate())}
          minuteStep={5}
          format="HH.mm"
          value={moment(value)}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
