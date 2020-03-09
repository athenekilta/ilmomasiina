import React from 'react';
import PropTypes from 'prop-types';
import nl2br from 'react-nl2br';
import _ from 'lodash';
import moment from 'moment';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import * as SingleEventActions from '../../modules/singleEvent/actions';
import SignupButton from './components/SignupButton';
import SignupList from './components/SignupList';
import ViewProgress from './components/ViewProgress';
import EnrollForm from './components/EnrollForm';
import signupState from '../../utils/signupStateText';
import './SingleEvent.scss';
import {
  getQuotaData,
  getFormattedQuestions,
} from '../../modules/singleEvent/selectors';
import { WAITLIST, OPENQUOTA } from '../../utils/signupUtils';
import { Link } from 'react-router';
import Countdown from 'react-countdown-now';

class SingleEvent extends React.Component {
  static propTypes = {
    updateEventAsync: PropTypes.func.isRequired,
    attachPositionAsync: PropTypes.func.isRequired,
    completeSignupAsync: PropTypes.func.isRequired,
    cancelSignupAsync: PropTypes.func.isRequired,
    params: PropTypes.object,
    event: PropTypes.object,
    eventLoading: PropTypes.bool,
    eventError: PropTypes.bool,
    signup: PropTypes.object,
    signupLoading: PropTypes.bool,
    signupError: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      formOpened: false,
    };

    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    this.props.updateEventAsync(this.props.params.id);
  }
  openForm(quota) {
    this.props.attachPositionAsync(quota.id);
    this.setState({ formOpened: true });
  }

  closeForm() {
    const close = window.confirm(
      'Oletko varma? Menetät paikkasi jonossa, jos suljet lomakkeen nyt.',
    );

    if (close) {
      this.props.cancelSignupAsync(
        this.props.signup.id,
        this.props.signup.editToken,
      );
      this.setState({ formOpened: false });
    }
    this.props.updateEventAsync(this.props.event.id);
  }

  async submitForm(answers) {
    this.toastId = toast.info('Ilmoittautuminen käynnissä', {});

    const response = await this.props.completeSignupAsync(
      this.props.signup.id,
      {
        editToken: this.props.signup.editToken,
        ...answers,
      },
    );
    let success = response === true;
    if (success) {
      toast.update(this.toastId, {
        render: 'Ilmoittautuminen onnistui!',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      this.props.updateEventAsync(this.props.event.id);
      this.setState({
        formOpened: false,
      });
    } else {
      let toast_text =
        'Ilmoittautuminen ei onnistunut. Tarkista, että kaikki pakolliset kentät on täytetty ja yritä uudestaan.';
      toast.update(this.toastId, {
        render: toast_text,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    }
  }

  renderSignupLists() {
    const { event, quotaData, formattedQuestions } = this.props;

    if (!event.signupsPublic) {
      return <p>Tapahtuman vastaukset eivät ole julkisia</p>;
    }

    if (!event.quota) {
      return null;
    }

    return (
      <div>
        <h2>Ilmoittautuneet</h2>
        {_.map(Object.keys(quotaData), quotaName => {
          const quota = quotaData[quotaName];

          if (quotaName === WAITLIST) {
            return (
              <SignupList
                title={'Jonossa'}
                questions={_.filter(formattedQuestions, 'public')}
                rows={quota.signups}
                key={quotaName}
              />
            );
          } else if (quotaName === OPENQUOTA) {
            return (
              <SignupList
                title={'Avoin kiintiö'}
                questions={_.filter(formattedQuestions, 'public')}
                rows={quota.signups}
                key={quotaName}
              />
            );
          } else {
            return (
              <SignupList
                title={quotaName}
                questions={_.filter(event.questions, 'public')}
                rows={quota.signups}
                key={quotaName}
              />
            );
          }
        })}
      </div>
    );
  }

  renderQuotaStatus() {
    const { event, quotaData } = this.props;

    if (!event.quota || event.quota.length === 0 || !event.signupsPublic) {
      return null;
    }

    return (
      <div className="sidebar-widget">
        <h3>Ilmoittautuneet</h3>
        {_.map(Object.keys(quotaData), quotaName => {
          const quota = quotaData[quotaName];
          if (quotaName === OPENQUOTA) {
            return (
              <ViewProgress
                title="Avoin"
                value={quota.signups.length}
                max={event.openQuotaSize}
                key={quotaName}
              />
            );
          } else if (quotaName === WAITLIST) {
            if (quota.signups && quota.signups.length > 0) {
              return <p>{`Jonossa: ${quota.signups.length}`}</p>;
            }
            return null;
          } else {
            return (
              <ViewProgress
                title={quotaName}
                value={Math.min(quota.signups.length, quota.size)}
                max={quota.size}
                key={quotaName}
              />
            );
          }
        })}
      </div>
    );
  }
  signupButtonRenderer(event, isOpen, total, seconds, ) {

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
          {total < 60000 && !isOpen ? <span style={{ color: "green" }} > {` (${seconds}  s)`}</span> : null}
        </p>
        {event.quota
          ? event.quota.map((quota, index) => (
            <SignupButton
              title={quota.title}
              isOpen={isOpen && !event.registrationClosed}
              openForm={() => this.openForm(quota)}
              isOnly={event.quota.length === 1}
              key={index} />

          ))
          : ''}
      </div>
    )

  }
  renderSignupButtons() {
    const { event } = this.props;
    return (
      <Countdown
        daysInHours={true}
        date={new Date(new Date().getTime() + event.millisTillOpening)}
        renderer={props => this.signupButtonRenderer(event, props.completed, props.total, props.seconds)}>
      </Countdown>

    );
  }

  render() {
    const { event, signup } = this.props;

    return (
      <div>
        {this.state.formOpened ? (
          <EnrollForm
            closeForm={this.closeForm}
            submitForm={this.submitForm}
            questions={event.questions}
            signup={signup}
            loading={this.props.signupLoading}
            error={this.props.signupError}
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
                    {event.date ? (
                      <p>
                        <strong>Ajankohta:</strong>{' '}
                        {moment(event.date).format('D.M.Y [klo] HH:mm')}
                      </p>
                    ) : null}
                    {event.location ? (
                      <p>
                        <strong>Sijainti:</strong> {event.location}
                      </p>
                    ) : null}
                    {event.price ? (
                      <p>
                        <strong>Hinta:</strong> {event.price}
                      </p>
                    ) : null}
                    {event.homepage ? (
                      <p>
                        <strong>Kotisivut:</strong>{' '}
                        <a href={event.homepage} title="Kotisivut">
                          {event.homepage}
                        </a>
                      </p>
                    ) : null}
                    {event.facebook ? (
                      <p>
                        <strong>Facebook-tapahtuma:</strong>{' '}
                        <a href={event.facebook} title="Facebook-tapahtuma">
                          {event.facebook}
                        </a>
                      </p>
                    ) : null}
                  </div>
                  <p>{nl2br(event.description)}</p>
                </div>
                <div className="col-xs-12 col-sm-4 pull-right">
                  {this.renderSignupButtons()}
                  {this.renderQuotaStatus()}
                </div>
                <div className="col-xs-12">{this.renderSignupLists()}</div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateEventAsync: SingleEventActions.updateEventAsync,
  attachPositionAsync: SingleEventActions.attachPositionAsync,
  completeSignupAsync: SingleEventActions.completeSignupAsync,
  cancelSignupAsync: SingleEventActions.cancelSignupAsync,
};

const mapStateToProps = state => ({
  event: state.singleEvent.event,
  eventLoading: state.singleEvent.eventLoading,
  eventError: state.singleEvent.eventError,
  signup: state.singleEvent.signup,
  signupLoading: state.singleEvent.signupLoading,
  signupError: state.singleEvent.signupError,
  quotaData: getQuotaData(state),
  formattedQuestions: getFormattedQuestions(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SingleEvent);
