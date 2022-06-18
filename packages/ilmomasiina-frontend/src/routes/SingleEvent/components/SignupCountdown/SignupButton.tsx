import React from 'react';

import { Button } from 'react-bootstrap';

import { Quota } from '@tietokilta/ilmomasiina-models/src/services/events';
import { useTypedSelector } from '../../../../store/reducers';
import signupState from '../../../../utils/signupStateText';

// Show the countdown one minute before opening the signup.
const COUNTDOWN_DURATION = 60 * 1000;

type SignupButtonProps = {
  isOpen: boolean;
  isClosed: boolean;
  beginSignup: (quotaId: Quota.Id) => void;
  seconds: number;
  total: number;
};

const SignupButton = ({
  isOpen, isClosed, beginSignup, seconds, total,
}: SignupButtonProps) => {
  const { registrationStartDate, registrationEndDate, quotas } = useTypedSelector((state) => state.singleEvent.event)!;
  const submitting = useTypedSelector((state) => state.singleEvent.creatingSignup);
  const isOnly = quotas.length === 1;

  return (
    <div className="sidebar-widget">
      <h3>Ilmoittautuminen</h3>
      <p>
        {signupState(registrationStartDate, registrationEndDate).label}
        {total < COUNTDOWN_DURATION && !isOpen && !isClosed && (
          <span style={{ color: 'green' }}>
            {` (${seconds}  s)`}
          </span>
        )}
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
