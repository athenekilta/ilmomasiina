import React from 'react';
import PropTypes from 'prop-types';
import { Input, Textarea } from 'formsy-react-components';
import './Editor.scss';


class BasicDetailsTab extends React.Component {

  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
    event: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(field, value) {
    this.props.onDataChange(field, value);
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
          onChange={this.handleChange}
        />
        <Input
          name="startDate"
          value={this.props.event.start_date}
          label="Alkamisajankohta"
          type="datetime-local"
          onChange={this.handleChange}
        />
        <Input
          name="endDate"
          value={this.props.event.end_date}
          label="Päättymisajankohta"
          type="datetime-local"
          onChange={this.handleChange}
        />
        <Input
          name="webpageUrl"
          value={this.props.event.webpage_url}
          label="Kotisivujen osoite"
          type="text"
          onChange={this.handleChange}
        />
        <Input
          name="facebookUrl"
          value={this.props.event.facebook_url}
          label="Facebook-tapahtuma"
          type="text"
          onChange={this.handleChange}
        />
        <Input
          name="location"
          value={this.props.event.location}
          label="Paikka"
          type="text"
          onChange={this.handleChange}
        />
        <Textarea
          rows={10}
          name="description"
          value={this.props.event.description}
          label="Kuvaus"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default BasicDetailsTab;
