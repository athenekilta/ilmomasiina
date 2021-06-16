/** @jsx jsx */
import { DatePicker, TimePicker } from 'antd';
import moment from 'moment';
import { jsx } from 'theme-ui';

import 'antd/lib/input/style/index.css';
import 'antd/lib/date-picker/style/index.css';
import 'antd/lib/time-picker/style/index.css';

type Props = {
  label?: string;
  name: string;
  value: string;
  formMethods: any;
};

const DateTimePicker = (props: Props) => {
  const { formMethods, label, name, value } = props;
  const { setValue, errors } = formMethods;

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
          onChange={date => setValue(name, date.toDate().toISOString())}
          defaultValue={moment(value)}
        />
        <TimePicker
          minuteStep={5}
          format="HH.mm"
          onChange={date => setValue(name, date.toDate().toISOString())}
          defaultValue={moment(value)}
        />
        <span sx={{ color: 'error' }}>
          {errors[name] && '* Tämä kenttä vaaditaan.'}
        </span>
      </div>
    </div>
  );
};

export default DateTimePicker;
