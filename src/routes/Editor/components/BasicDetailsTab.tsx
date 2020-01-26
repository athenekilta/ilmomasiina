import React from 'react';

import { Checkbox, Input, Label, Textarea } from '@theme-ui/components';

import { Event } from '../../../modules/types';
import DateTimePicker from './DateTimePicker';

type Props = {
  event: Event;
  formMethods: any;
  updateEventField: any;
};

const BasicDetailsTab = (props: Props) => {
  const { event, formMethods, updateEventField } = props;
  const { register } = formMethods;

  return (
    <div>
      <Label htmlFor="title">Tapahtuman nimi</Label>
      <Input
        name="title"
        type="text"
        defaultValue={event.title ? event.title : ''}
        placeholder="Tapahtuman nimi"
        ref={register({ required: true })}
      />
      <Label htmlFor="date">Ajankohta</Label>
      <DateTimePicker
        name="date"
        value={event.date}
        updateEventField={updateEventField}
      />
      <Label htmlFor="webpageUrl">Kotisivujen osoite</Label>
      <Input
        name="webpageUrl"
        type="text"
        defaultValue={event.webpageUrl ? event.webpageUrl : ''}
        placeholder="Kotisivujen osoite"
        ref={register}
      />
      <Label htmlFor="facebookUrl">Facebook-tapahtuma</Label>
      <Input
        name="facebookUrl"
        defaultValue={event.facebookUrl ? event.facebookUrl : ''}
        type="text"
        ref={register}
      />
      <Label htmlFor="location">Paikka</Label>
      <Input
        name="location"
        defaultValue={event.location ? event.location : ''}
        type="text"
        ref={register}
      />
      <Label htmlFor="description">Kuvaus</Label>
      <Textarea
        rows={10}
        name="description"
        defaultValue={event.description ? event.description : ''}
        ref={register}
      />
      <Label htmlFor="signupsPublic">Ilmoittautumiset ovat julkisia</Label>
      <Checkbox
        name="signupsPublic"
        defaultChecked={event.signupsPublic ? event.signupsPublic : false}
        ref={register}
      />
    </div>
  );
};

export default BasicDetailsTab;
