import React, { useCallback, useState } from 'react';

import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Quota } from '@tietokilta/ilmomasiina-models/src/services/events';
import { useNavigate } from '../../../config/router';
import { usePaths } from '../../../contexts/paths';
import { useSingleEventContext } from '../../../modules/singleEvent';
import { beginSignup } from '../../../modules/singleEvent/actions';
import { signupState, signupStateText } from '../../../utils/signupStateText';

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
  const navigate = useNavigate();
  const paths = usePaths();
  const { registrationStartDate, registrationEndDate, quotas } = useSingleEventContext().event!;
  const eventState = signupState(registrationStartDate, registrationEndDate);
  const [submitting, setSubmitting] = useState(false);
  const isOnly = quotas.length === 1;

  const onClick = useCallback(async (quotaId: Quota.Id) => {
    if (!isOpen) return;
    setSubmitting(true);
    try {
      const response = await beginSignup(quotaId);
      setSubmitting(false);
      navigate(paths.editSignup(response.id, response.editToken));
    } catch (e) {
      setSubmitting(false);
      toast.error('Ilmoittautuminen epäonnistui.', {
        autoClose: 5000,
      });
    }
  }, [navigate, paths, isOpen]);

  return (
    <div className="ilmo--side-widget">
      <h3>Ilmoittautuminen</h3>
      <p>
        {signupStateText(eventState).shortLabel}
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
          className="ilmo--signup-button"
          onClick={() => onClick(quota.id)}
        >
          {isOnly ? 'Ilmoittaudu nyt' : `Ilmoittaudu: ${quota.title}`}
        </Button>
      ))}
    </div>
  );
};

export default SignupButton;
