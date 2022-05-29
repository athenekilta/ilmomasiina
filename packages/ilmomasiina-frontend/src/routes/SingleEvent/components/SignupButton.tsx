import React, { useState } from 'react';

import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Quota } from '@tietokilta/ilmomasiina-models/src/services/events';
import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';
import apiFetch from '../../../api';
import { paths } from '../../../paths';
import signupState from '../../../utils/signupStateText';
import { useSingleEventContext } from '../state';

// Show the countdown one minute before opening the signup.
const COUNTDOWN_DURATION = 60 * 1000;

type SignupButtonProps = {
  isOpen: boolean;
  isClosed: boolean;
  seconds: number;
  total: number;
};

const SignupButton = ({
  isOpen, isClosed, seconds, total,
}: SignupButtonProps) => {
  const history = useHistory();
  const { registrationStartDate, registrationEndDate, quotas } = useSingleEventContext().event!;
  const [submitting, setSubmitting] = useState(false);
  const isOnly = quotas.length === 1;

  async function beginSignup(quotaId: Quota.Id) {
    setSubmitting(true);
    try {
      const response = await apiFetch('signups', {
        method: 'POST',
        body: { quotaId },
      }) as Signup.Create.Response;
      setSubmitting(false);
      history.push(paths().editSignup(response.id, response.editToken));
    } catch (e) {
      setSubmitting(false);
      toast.error('Ilmoittautuminen epäonnistui.', {
        autoClose: 5000,
      });
    }
  }

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
