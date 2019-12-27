import React from 'react';

import { Checkbox, Input, Textarea } from 'formsy-react-components';
import PropTypes from 'prop-types';

import DateTimePicker from './DateTimePicker';

class BasicDetailsTab extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
    event: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      date: null,
      dateFocused: false,
    };

    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({ date });
  }

  render() {
    const { event } = this.props;

    return (
      <div>
        <Input
          name="title"
          value={event.title ? event.title : ''}
          label="Tapahtuman nimi"
          type="text"
          required
          onChange={this.props.onDataChange}
        />
        <DateTimePicker
          name="date"
          value={event.date}
          label="Ajankohta"
          required
          onChange={this.props.onDataChange}
        />
        <Input
          name="webpageUrl"
          value={event.webpageUrl ? event.webpageUrl : ''}
          label="Kotisivujen osoite"
          type="text"
          onChange={this.props.onDataChange}
        />
        <Input
          name="facebookUrl"
          value={event.facebookUrl ? event.facebookUrl : ''}
          label="Facebook-tapahtuma"
          type="text"
          onChange={this.props.onDataChange}
        />
        <Input
          name="location"
          value={event.location ? event.location : ''}
          label="Paikka"
          type="text"
          onChange={this.props.onDataChange}
        />
        <Textarea
          rows={10}
          name="description"
          value={event.description ? event.description : ''}
          label="Kuvaus"
          onChange={this.props.onDataChange}
        />
        <Checkbox
          name="signupsPublic"
          value={event.signupsPublic ? event.signupsPublic : false}
          label="Ilmoittautumiset ovat julkisia"
          onChange={this.props.onDataChange}
        />
      </div>
    );
  }
}

export default BasicDetailsTab;
