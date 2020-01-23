import React from 'react';

import DatePicker from 'antd/lib/date-picker';
import locale from 'antd/lib/date-picker/locale/fi_FI';
import TimePicker from 'antd/lib/time-picker';
import moment from 'moment-timezone';
import { Controller } from 'react-hook-form';

type Props = {
  label: string;
  name: string;
  formMethods: any;
  value: string;
};

const DateTimePicker = (props: Props) => {
  const { formMethods, label, name, value } = props;
  const { control } = formMethods;

  return (
    <div className="form-group row">
      {label && (
        <label className="control-label col-sm-3" data-required="false">
          {label}
        </label>
      )}
      <div className="col-sm-9">
        <Controller
          as={DatePicker}
          locale={locale}
          format="DD.MM.YYYY"
          name={name}
          control={control}
          defaultValue={moment(value)}
        />
        <Controller
          as={TimePicker}
          locale={locale}
          format="HH.mm"
          name={name}
          control={control}
          defaultValue={moment(value)}
          placeholder="Valitse aika"
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
