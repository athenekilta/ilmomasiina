import React from 'react';
import PropTypes from 'prop-types';
import { Input, Textarea, Checkbox } from 'formsy-react-components';
import './Editor.scss';


class BasicDetailsTab extends React.Component {

  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
    event: PropTypes.object,
  }

  render() {
    return (
      <div>
        <Input
          name="title"
          value={this.props.event.title}
          label="Tapahtuman nimi"
          type="text"
          required
          onChange={this.props.onDataChange}
        />
        <Input
          name="startDate"
          value={this.props.event.startDate}
          label="Alkamisajankohta"
          type="datetime-local"
          onChange={this.props.onDataChange}
        />
        <Input
          name="endDate"
          value={this.props.event.endDate}
          label="Päättymisajankohta"
          type="datetime-local"
          onChange={this.props.onDataChange}
        />
        <Input
          name="webpageUrl"
          value={this.props.event.webpageUrl}
          label="Kotisivujen osoite"
          type="text"
          onChange={this.props.onDataChange}
        />
        <Input
          name="facebookUrl"
          value={this.props.event.facebookUrl}
          label="Facebook-tapahtuma"
          type="text"
          onChange={this.props.onDataChange}
        />
        <Input
          name="location"
          value={this.props.event.location}
          label="Paikka"
          type="text"
          onChange={this.props.onDataChange}
        />
        <Textarea
          rows={10}
          name="description"
          value={this.props.event.description}
          label="Kuvaus"
          onChange={this.props.onDataChange}
        />
        <Checkbox
          name="answersPublic"
          value={this.props.event.answersPublic}
          label="Vastaukset ovat julkisia"
          onChange={this.props.onDataChange}
        />
      </div>
    );
  }
}

export default BasicDetailsTab;
