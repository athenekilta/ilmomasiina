/** @jsx jsx */
import { Checkbox, Input, Label, Textarea } from '@theme-ui/components';
import { jsx } from 'theme-ui';

import { Event } from '../../../modules/types';
import DateTimePicker from './DateTimePicker';

type Props = {
  event: Event;
  formMethods: any;
};

const BasicDetailsTab = (props: Props) => {
  const { event, formMethods } = props;
  const { errors, register } = formMethods;

  return (
    <div>
      <Label htmlFor="title">Tapahtuman nimi</Label>
      <Input
        name="title"
        type="text"
        placeholder="Tapahtuman nimi"
        ref={register({ required: true })}
      />
      <span sx={{ color: 'error' }}>
        {errors.title && '* Otsikko vaaditaan.'}
      </span>
      <Label htmlFor="date">Ajankohta</Label>
      <DateTimePicker
        name="date"
        value={event.date}
        formMethods={formMethods}
      />
      <Label htmlFor="webpageUrl">Kotisivujen osoite</Label>
      <Input
        name="webpageUrl"
        type="text"
        placeholder="Kotisivujen osoite"
        ref={register}
      />
      <Label htmlFor="facebookUrl">Facebook-tapahtuma</Label>
      <Input name="facebookUrl" type="text" ref={register} />
      <Label htmlFor="location">Paikka</Label>
      <Input name="location" type="text" ref={register} />
      <Label htmlFor="description">Kuvaus</Label>
      <Textarea rows={10} name="description" ref={register} />
      <Label>
        <Checkbox name="signupsPublic" ref={register} />
        Ilmoittautumiset ovat julkisia
      </Label>
    </div>
  );
};

export default BasicDetailsTab;
