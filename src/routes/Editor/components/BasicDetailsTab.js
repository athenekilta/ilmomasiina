import React from 'react';
import PropTypes from 'prop-types';
import { Input, Textarea, Checkbox } from 'formsy-react-components';
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
          label="Tapahtuman nimi / Event title"
          type="text"
          required
          onChange={this.props.onDataChange}
        />
        <DateTimePicker name="date" value={event.date} label="Ajankohta / Date"
          required onChange={this.props.onDataChange} />
        <Input
          name="webpageUrl"
          value={event.webpageUrl ? event.webpageUrl : ''}
          label="Kotisivujen osoite / Website"
          type="text"
          onChange={this.props.onDataChange}
        />
        <Input
          name="facebookUrl"
          value={event.facebookUrl ? event.facebookUrl : ''}
          label="Facebook-tapahtuma / Faceboox event"
          type="text"
          onChange={this.props.onDataChange}
        />
        <Input
          name="image"
          value={event.image ? event.image : ''}
          label="Kuva / Photo (URL)"
          type="text"
          onChange={this.props.onDataChange}
        />
        <Input
          name="location"
          value={event.location ? event.location : ''}
          label="Paikka / Location"
          type="text"
          onChange={this.props.onDataChange}
        />
        <Textarea
          rows={10}
          name="description"
          value={event.description ? event.description : ''}
          label="Kuvaus / description"
          onChange={this.props.onDataChange}
        />
        <Checkbox
          name="signupsPublic"
          value={event.signupsPublic ? event.signupsPublic : false}
          label="Ilmoittautumiset ovat julkisia / Participants are public"
          onChange={this.props.onDataChange}
        />
      </div>
    );
  }
}

export default BasicDetailsTab;
