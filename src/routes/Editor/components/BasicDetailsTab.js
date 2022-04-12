import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Formsy, { HOC } from 'formsy-react';
import { Editor } from 'react-draft-wysiwyg';
import { Input, Textarea, Checkbox } from 'formsy-react-components';
import DateTimePicker from './DateTimePicker';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';


class BasicDetailsTab extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
    event: PropTypes.object,
  };

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
    this.props.event.description = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  }

  constructor(props) {
    super(props);
    this.state = {
      date: null,
      dateFocused: false,
      editorState: EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(this.props.event.description),
        ),
      ),
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
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
        <DateTimePicker name="date" value={event.date} label="Ajankohta" required onChange={this.props.onDataChange} />
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
        <div className="parent">
          <div className="title">
            <p><strong>Kuvaus</strong></p>
          </div>
          <Editor
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            editorState={this.state.editorState}
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{
              options: ['inline', 'emoji', 'image'],
              inline: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ['bold', 'italic', 'underline', 'strikethrough'],
              },
              image: {
                urlEnabled: true,
                uploadEnabled: false,
                alignmentEnabled: true,
                uploadCallback: undefined,
                previewImage: true,
                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                alt: { present: false, mandatory: false },
                defaultSize: {
                  height: '400',
                  width: '600',
                },
              },
            }}
            />
        </div>
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
