/** @jsx jsx */
import {
  Checkbox, Input, Label, Textarea,
} from '@theme-ui/components';
import { Field, useFormikContext } from 'formik';
import { jsx } from 'theme-ui';

import { EditorEvent } from '../../../modules/editor/types';
import DateTimePicker from './DateTimePicker';

const BasicDetailsTab = () => {
  const { errors } = useFormikContext<EditorEvent>();
  return (
    <div>
      <Label htmlFor="title">Tapahtuman nimi</Label>
      <Field as={Input} name="title" id="webpageUrl" type="text" required />
      <span sx={{ color: 'error' }}>
        {errors.title && '* Otsikko vaaditaan.'}
      </span>
      <Label htmlFor="date">Ajankohta</Label>
      <Field as={DateTimePicker} name="date" />
      <Label htmlFor="webpageUrl">Kotisivujen osoite</Label>
      <Field as={Input} name="webpageUrl" id="webpageUrl" type="text" />
      <Label htmlFor="facebookUrl">Facebook-tapahtuma</Label>
      <Field as={Input} name="facebookUrl" id="facebookUrl" type="text" />
      <Label htmlFor="location">Paikka</Label>
      <Field as={Input} name="location" id="location" type="text" />
      <Label htmlFor="description">Kuvaus</Label>
      <Textarea rows={10} name="description" />
      <Label>
        <Checkbox name="signupsPublic" />
        Ilmoittautumiset ovat julkisia
      </Label>
    </div>
  );
};

export default BasicDetailsTab;
