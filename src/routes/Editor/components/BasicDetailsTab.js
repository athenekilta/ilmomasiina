import React from 'react';
import PropTypes from 'prop-types';
import { Input, Textarea, Checkbox } from 'formsy-react-components';
import './Editor.scss';

class BasicDetailsTab extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
    event: PropTypes.object,
  };

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
        <Input
          name="startDate"
          value={event.startDate ? event.startDate : ''}
          label="Alkamisajankohta"
          type="datetime-local"
          onChange={this.props.onDataChange}
        />
        <Input
          name="endDate"
          value={event.endDate ? event.endDate : ''}
          label="Päättymisajankohta"
          type="datetime-local"
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
          name="answersPublic"
          value={event.answersPublic ? event.answersPublic : false}
          label="Vastaukset ovat julkisia"
          onChange={this.props.onDataChange}
        />
      </div>
    );
  }
}

export default BasicDetailsTab;
