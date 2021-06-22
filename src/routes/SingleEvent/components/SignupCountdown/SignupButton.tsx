import React from 'react';

import { Quota } from '../../../../api/events';
import { useTypedSelector } from '../../../../store/reducers';
import signupState from '../../../../utils/signupStateText';

import './SignupButton.scss';

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

  const event = useTypedSelector((state) => state.singleEvent.event)!;
  const isOnly = event.quota.length === 1;

  return (
    <div className="sidebar-widget">
      <h3>Ilmoittautuminen</h3>
      <p>
        {
          signupState(
            event.date,
            event.registrationStartDate,
            event.registrationEndDate,
          ).label
        }
        {total < 60000 && !isOpen ? (
          <span style={{ color: 'green' }}>
            {` (${seconds}  s)`}
          </span>
        ) : null}
      </p>
      {event.quota.map((quota) => (
        <p key={quota.id}>
          <button
            type="button"
            disabled={!isOpen}
            className="btn btn-default btn-block btn-whitespace-normal"
            onClick={() => isOpen && beginSignup(quota.id)}
          >
            {isOnly ? 'Ilmoittaudu nyt' : `Ilmoittaudu: ${quota.title}`}
          </button>
        </p>
      ))}
    </div>
  );
};

export default SignupButton;
