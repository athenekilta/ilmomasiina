import React from 'react';

import { Button } from 'react-bootstrap';

import { Quota } from '../../../../api/events';
import { useTypedSelector } from '../../../../store/reducers';
import signupState from '../../../../utils/signupStateText';

// Show the countdown one minute before opening the signup.
const COUNTDOWN_DURATION = 60 * 1000;

type SignupButtonProps = {
  isOpen: boolean;
  beginSignup: (quotaId: Quota.Id) => void;
  seconds: number;
  total: number;
};

const SignupButton = (props: SignupButtonProps) => {
  const {
    isOpen, beginSignup, seconds, total,
  } = props;

  const {
    date, registrationStartDate, registrationEndDate, quotas,
  } = useTypedSelector((state) => state.singleEvent.event)!;
  const submitting = useTypedSelector((state) => state.singleEvent.signupSubmitting);
  const isOnly = quotas.length === 1;

  return (
    <div className="sidebar-widget">
      <h3>Ilmoittautuminen</h3>
      <p>
        {signupState(date, registrationStartDate, registrationEndDate).label}
        {total < COUNTDOWN_DURATION && !isOpen ? (
          <span style={{ color: 'green' }}>
            {` (${seconds}  s)`}
          </span>
        ) : null}
      </p>
      {quotas.map((quota) => (
        <Button
          key={quota.id}
          type="button"
          variant="secondary"
          disabled={!isOpen || submitting}
          className="mb-3"
          onClick={() => isOpen && beginSignup(quota.id)}
        >
          {isOnly ? 'Ilmoittaudu nyt' : `Ilmoittaudu: ${quota.title}`}
        </Button>
      ))}
    </div>
  );
};

export default SignupButton;
