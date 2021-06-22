import React from 'react';

import { EventGetQuotaItem, EventGetResponse } from '../../../../api/events';
import signupState from '../../../../utils/signupStateText';

import './SignupButton.scss';

type SignupButtonProps = {
  event: EventGetResponse;
  isOnly: boolean;
  isOpen: boolean;
  openForm: (quotaId: EventGetQuotaItem['id']) => void;
  seconds: number;
  total: number;
};

const SignupButton = (props: SignupButtonProps) => {
  const {
    event, isOnly, isOpen, openForm, seconds, total,
  } = props;

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
            onClick={() => isOpen && openForm(quota.id)}
          >
            {isOnly ? 'Ilmoittaudu nyt' : `Ilmoittaudu: ${quota.title}`}
          </button>
        </p>
      ))}
    </div>
  );
};

export default SignupButton;
