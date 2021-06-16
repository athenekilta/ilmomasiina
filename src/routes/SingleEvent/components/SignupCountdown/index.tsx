import React from 'react';

import _ from 'lodash';
import Countdown from 'react-countdown-now';

import { Event, Quota } from '../../../../modules/types';
import SignupButton from './SignupButton';

type CountDownProps = {
  event: Event;
  openForm: (quota: Quota) => void;
};

const CountDown = (props: CountDownProps) => {
  const { event, openForm } = props;

  if (!event.id) return null;

  return (
    <Countdown
      daysInHours
      date={new Date(new Date().getTime() + event.millisTillOpening)}
      renderer={props => (
        <SignupButton
          event={event}
          isOnly={event.quota.length === 1}
          isOpen={props.completed && !event.registrationClosed}
          openForm={openForm}
          seconds={props.seconds}
          total={props.total}
        />
      )}
    />
  );
};

export default CountDown;
