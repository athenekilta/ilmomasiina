import React from 'react';
import PropTypes from 'prop-types';
import { Input, Textarea } from 'formsy-react-components';
import './Editor.scss';


class BasicDetailsTab extends React.Component {

  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };

    this.handleChange = this.handleChange.bind(this);
  }

  updateState(updates) {
    this.setState(updates, () => {
      if (typeof this.props.onDataChange === 'function') {
        this.props.onDataChange(this.state.data);
      }
    });
  }

  handleChange(field, value) {
    this.updateState({
      data: { ...this.state.data, [field]: value },
    });
  }

  render() {
    return (
      <div>
        <Input
          name="title"
          value=""
          label="Tapahtuman nimi"
          type="text"
          required
          onChange={this.handleChange}
        />
        <Input
          name="start_date"
          value=""
          label="Alkamisajankohta"
          type="datetime-local"
          onChange={this.handleChange}
        />
        <Input
          name="end_date"
          value=""
          label="Päättymisajankohta"
          type="datetime-local"
          onChange={this.handleChange}
        />
        <Input
          name="webpage_url"
          value=""
          label="Kotisivujen osoite"
          type="text"
          onChange={this.handleChange}
        />
        <Input
          name="facebook_url"
          value=""
          label="Facebook-tapahtuma"
          type="text"
          onChange={this.handleChange}
        />
        <Input
          name="location"
          value=""
          label="Paikka"
          type="text"
          onChange={this.handleChange}
        />
        <Textarea
          rows={10}
          name="description"
          value=""
          label="Kuvaus"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default BasicDetailsTab;
