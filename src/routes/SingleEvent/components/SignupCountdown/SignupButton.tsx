import React from "react";
import signupState from "../../../../utils/signupStateText";

import { Event, Quota } from "../../../../modules/types";

import "./SignupButton.scss";

type SignupButtonProps = {
  event: Event;
  isOnly: boolean;
  isOpen: boolean;
  openForm: (quota: Quota) => void;
  seconds: number;
  total: number;
};

const SignupButton = (props: SignupButtonProps) => {
  const { event, isOnly, isOpen, openForm, seconds, total } = props;

  return (
    <div className="sidebar-widget">
      <h3>Ilmoittautuminen</h3>
      <p>
        {
          signupState(
            event.date,
            event.registrationStartDate,
            event.registrationEndDate
          ).label
        }
        {total < 60000 && !isOpen ? (
          <span style={{ color: "green" }}> {` (${seconds}  s)`}</span>
        ) : null}
      </p>
      {event.quota
        ? event.quota.map((quota, index) => (
            <p key={index}>
              <button
                disabled={!isOpen}
                className="btn btn-default btn-block btn-whitespace-normal"
                onClick={() => (isOpen ? openForm(quota) : {})}
              >
                {isOnly ? "Ilmoittaudu nyt" : `Ilmoittaudu: ${quota.title}`}
              </button>
            </p>
          ))
        : ""}
    </div>
  );
};

export default SignupButton;
