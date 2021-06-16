import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import moment from 'moment';
import nl2br from 'react-nl2br';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  attachPositionAsync,
  cancelSignupAsync,
  completeSignup,
  updateEventAsync
} from '../../modules/singleEvent/actions';
import {
  getFormattedQuestions,
  getQuotaData
} from '../../modules/singleEvent/selectors';
import { Event, Question, Quota, Signup } from '../../modules/types';
import { AppState } from '../../store/types';
import EnrollForm from './components/EnrollForm';
import QuotaStatus from './components/QuotaStatus';
import SignupCountdown from './components/SignupCountdown';
import SignupList from './components/SignupList';

import './SingleEvent.scss';

interface MatchParams {
  id?: string;
}

interface SingleEventProps extends RouteComponentProps<MatchParams> {
  children: React.ReactChildren;
}

type Props = SingleEventProps & LinkStateProps & LinkDispatchProps;

const SingleEvent: React.FC = (props: Props) => {
  const {
    updateEventAsync,
    attachPositionAsync,
    completeSignup,
    cancelSignupAsync,
    match,
    event,
    eventLoading,
    eventError,
    formattedQuestions,
    quotaData,
    signup,
    signupLoading,
    signupError
  } = props;

  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    updateEventAsync(match.params.id);
  }, []);

  function openForm(quota: Quota) {
    attachPositionAsync(quota.id);
    setFormOpen(true);
  }

  function closeForm() {
    const close = window.confirm(
      'Oletko varma? Menetät paikkasi jonossa, jos suljet lomakkeen nyt.'
    );

    if (close) {
      cancelSignupAsync(signup.id, signup.editToken);
      setFormOpen(false);
    }
    updateEventAsync(event.id);
  }

  async function submitForm(answers) {
    const toastId = toast.info('Ilmoittautuminen käynnissä', {});

    const response = completeSignup(signup.id, {
      editToken: signup.editToken,
      ...answers
    });

    const success = response === true;
    if (success) {
      toast.update(toastId, {
        render: 'Ilmoittautuminen onnistui!',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000
      });
      updateEventAsync(event.id);
      setFormOpen(false);
    } else {
      const toast_text =
        'Ilmoittautuminen ei onnistunut. Tarkista, että kaikki pakolliset kentät on täytetty ja yritä uudestaan.';
      toast.update(toastId, {
        render: toast_text,
        type: toast.TYPE.ERROR,
        autoClose: 5000
      });
    }
  }

  return (
    <div>
      {formOpen ? (
        <EnrollForm
          closeForm={closeForm}
          submitForm={submitForm}
          questions={event.questions}
          signup={signup}
          loading={signupLoading}
          error={signupError}
          event={event}
          key={event.id}
        />
      ) : (
        <div className="container singleEventContainer">
          <Link to={`${PREFIX_URL}/`} style={{ margin: 0 }}>
            &#8592; Takaisin
          </Link>
          <div className="row">
            <div className="col-xs-12 col-sm-8">
              <h1>{event.title}</h1>
              <div className="event-heading">
                {event.date && (
                  <p>
                    <strong>Ajankohta:</strong>{' '}
                    {moment(event.date).format('D.M.Y [klo] HH:mm')}
                  </p>
                )}
                {event.location && (
                  <p>
                    <strong>Sijainti:</strong> {event.location}
                  </p>
                )}
                {event.price && (
                  <p>
                    <strong>Hinta:</strong> {event.price}
                  </p>
                )}
                {event.homepage && (
                  <p>
                    <strong>Kotisivut:</strong>{' '}
                    <a href={event.homepage} title="Kotisivut">
                      {event.homepage}
                    </a>
                  </p>
                )}
                {event.facebook && (
                  <p>
                    <strong>Facebook-tapahtuma:</strong>{' '}
                    <a href={event.facebook} title="Facebook-tapahtuma">
                      {event.facebook}
                    </a>
                  </p>
                )}
              </div>
              <p>{nl2br(event.description)}</p>
            </div>
            <div className="col-xs-12 col-sm-4 pull-right">
              <SignupCountdown event={event} openForm={openForm} />
              <QuotaStatus event={event} quotaData={quotaData} />
            </div>
            <div className="col-xs-12">
              <h2>Ilmoittautuneet</h2>
              {_.map(_.keys(quotaData), quotaName => (
                <SignupList
                  quotaName={quotaName}
                  questions={_.filter(formattedQuestions, 'public')}
                  signups={quotaData[quotaName].signups}
                  key={quotaName}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface LinkStateProps {
  event: Event;
  eventLoading: boolean;
  eventError: boolean;
  signup: Signup;
  signupLoading: boolean;
  signupError: boolean;
  quotaData: Quota;
  formattedQuestions: Question[];
}

interface LinkDispatchProps {
  updateEventAsync: (eventId: string) => void;
  attachPositionAsync: (quotaId: string) => void;
  completeSignup: (signupId: string, data: any) => boolean;
  cancelSignupAsync: (signupId: string, editToken: string) => void;
}

const mapStateToProps = (state: AppState) => ({
  state: state,
  event: state.singleEvent.event,
  eventLoading: state.singleEvent.eventLoading,
  eventError: state.singleEvent.eventError,
  signup: state.singleEvent.signup,
  signupLoading: state.singleEvent.signupLoading,
  signupError: state.singleEvent.signupError,
  quotaData: getQuotaData(state),
  formattedQuestions: getFormattedQuestions(state)
});

const mapDispatchToProps = {
  updateEventAsync: updateEventAsync,
  attachPositionAsync: attachPositionAsync,
  completeSignup: completeSignup,
  cancelSignupAsync: cancelSignupAsync
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleEvent);
