import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Input } from 'formsy-react-components';
import locale from 'antd/lib/date-picker/locale/fi_FI';
import DatePicker from 'antd/lib/date-picker';
import TimePicker from 'antd/lib/time-picker';

class DateTimePicker extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    required: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
  };

  constructor(props) {
    super(props);

    this.changeDate = this.changeDate.bind(this);
    this.changeTime = this.changeTime.bind(this);
  }

  toMoment(date) {
    return date
      ? moment(date, 'YYYY-MM-DDTHH:mm').tz('Europe/Helsinki')
      : moment()
          .tz('Europe/Helsinki')
          .hour(0)
          .minute(0)
          .second(0);
  }

  changeDate(mom) {
    const datetime = this.toMoment(this.props.value)
      .date(mom.date())
      .month(mom.month())
      .year(mom.year());

    this.props.onChange(this.props.name, datetime.toDate());
  }

  changeTime(mom) {
    const datetime = this.toMoment(this.props.value)
      .hour(mom.hour())
      .minute(mom.minute());

    this.props.onChange(this.props.name, datetime.toDate());
  }

  render() {
    const value = this.props.value ? this.toMoment(this.props.value) : null;

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3" data-required="false">
          {this.props.label}
          {this.props.required ? <span className="required-symbol"> *</span> : null}
        </label>
        <div className="col-sm-9">
          <Input
            type="hidden"
            name={this.props.name}
            value={this.props.value ? this.props.value : ''}
            required={this.props.required}
          />
          <DatePicker locale={locale} format="DD.MM.YYYY" onChange={this.changeDate} value={value} />
          <TimePicker
            placeholder={'Valitse aika'}
            onChange={this.changeTime}
            minuteStep={5}
            format="HH.mm"
            value={value}
          />
        </div>
      </div>
    );
  }
}

module.exports = DateTimePicker;
