import React from 'react';

import { Checkbox, Input, Textarea } from 'formsy-react-components';

import { Event } from '../../../modules/types';
import DateTimePicker from './DateTimePicker';

type Props = {
  event: Event;
  onDataChange: (field: string, value: any) => void;
};

const BasicDetailsTab = (props: Props) => {
  const { event, onDataChange } = props;

  return (
    <div>
      <Input
        name="title"
        value={event.title ? event.title : ''}
        label="Tapahtuman nimi"
        type="text"
        required
        onChange={onDataChange}
      />
      <DateTimePicker
        name="date"
        value={event.date}
        label="Ajankohta"
        required
        onChange={onDataChange}
      />
      <Input
        name="webpageUrl"
        value={event.webpageUrl ? event.webpageUrl : ''}
        label="Kotisivujen osoite"
        type="text"
        onChange={onDataChange}
      />
      <Input
        name="facebookUrl"
        value={event.facebookUrl ? event.facebookUrl : ''}
        label="Facebook-tapahtuma"
        type="text"
        onChange={onDataChange}
      />
      <Input
        name="location"
        value={event.location ? event.location : ''}
        label="Paikka"
        type="text"
        onChange={onDataChange}
      />
      <Textarea
        rows={10}
        name="description"
        value={event.description ? event.description : ''}
        label="Kuvaus"
        onChange={onDataChange}
      />
      <Checkbox
        name="signupsPublic"
        value={event.signupsPublic ? event.signupsPublic : false}
        label="Ilmoittautumiset ovat julkisia"
        onChange={onDataChange}
      />
    </div>
  );
};

export default BasicDetailsTab;
