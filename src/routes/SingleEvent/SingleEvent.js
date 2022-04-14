import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import ReactAutolinker from 'react-autolinker';
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
      "Oletko varma? Menetät paikkasi jonossa, jos suljet lomakkeen nyt. / Are you sure? You'll lose your place in the queue on closing now",
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
    this.toastId = toast.info('Ilmoittautuminen käynnissä / Registration in progress', {});

    const response = await this.props.completeSignupAsync(
      this.props.signup.id,
      {
        editToken: this.props.signup.editToken,
        ...answers,
      },
    );
    const success = response === true;
    if (success) {
      toast.update(this.toastId, {
        render: 'Ilmoittautuminen onnistui! / Registration succeeded!',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      this.props.updateEventAsync(this.props.event.id);
      this.setState({
        formOpened: false,
      });
    } else {
      let toast_text = // eslint-disable-line
        'Ilmoittautuminen ei onnistunut. Tarkista, että kaikki pakolliset kentät on täytetty ja yritä uudestaan. / Registration failed. Check that all the required fields are filled.';
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
      return <p>Tapahtuman vastaukset eivät ole julkisia / Answers to the event are not public</p>;
    }

    if (!event.quota) {
      return null;
    }

    return (
      <div>
        <h2>Ilmoittautuneet / Participants</h2>
        {_.map(Object.keys(quotaData), (quotaName) => {
          const quota = quotaData[quotaName];

          if (quotaName === WAITLIST) {
            return (
              <SignupList
                title={'Jonossa / In queue'}
                questions={_.filter(formattedQuestions, 'public')}
                rows={quota.signups}
                key={quotaName}
              />
            );
          } else if (quotaName === OPENQUOTA) {
            return (
              <SignupList
                title={'Avoin kiintiö / Open quota'}
                questions={_.filter(formattedQuestions, 'public')}
                rows={quota.signups}
                key={quotaName}
              />
            );
          }
          return (
            <SignupList
              title={quotaName}
              questions={_.filter(event.questions, 'public')}
              rows={quota.signups}
              key={quotaName}
              />
          );
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
        <h3>Ilmoittautuneet / Participants</h3>
        {_.map(Object.keys(quotaData), (quotaName) => {
          const quota = quotaData[quotaName];
          if (quotaName === OPENQUOTA) {
            return (
              <ViewProgress
                title="Avoin / Open"
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
          }
          return (
            <ViewProgress
              title={quotaName}
              value={Math.min(quota.signups.length, quota.size)}
              max={quota.size}
              key={quotaName}
              />
          );
        })}
      </div>
    );
  }
  signupButtonRenderer(event, isOpen, total, seconds) {
    return (
      <div className="sidebar-widget">
        <h3>Ilmoittautuminen / Registration</h3>
        <p>
          {
            signupState(
              event.date,
              event.registrationStartDate,
              event.registrationEndDate,
            ).label
          }
          {total < 60000 && !isOpen ? <span style={{ color: 'green' }} > {` (${seconds}  s)`}</span> : null}
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
    );
  }
  renderSignupButtons() {
    const { event } = this.props;
    return (
      <Countdown
        daysInHours
        date={new Date(new Date().getTime() + event.millisTillOpening)}
        renderer={props => this.signupButtonRenderer(event, props.completed, props.total, props.seconds)}
      />
    );
  }

  /*
  facebookEventPhoto(eventId) {
    FB.api(
      `/${eventId}/photos`,
      'GET',
      {},
      (response) => {
        response.data
      },
    );
  } */
  // TODO Facebook event photo here https://developers.facebook.com/docs/graph-api/reference/v8.0/event/photos

  render() {
    const { event, signup } = this.props;
    //The ReactAutoLinker library does not support telegram by default, so we need to create our own link.
    const renderLink = (tag) => { 
      tag.attrs.href = tag.attrs.href.replace('twitter.com', 't.me')
      tag.attrs.key = tag.attrs.key.replace('twitter.com', 't.me')
      return React.createElement(tag.tagName, tag.attrs, tag.innerHtml) }

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
                &#8592; Takaisin / Back
            </Link>
            <div className="row">
              <div className="col-xs-12 col-sm-8">
                <h1>{event.title}</h1>
                <div className="event-heading">
                  {event.date ? (
                    <p>
                      <strong>Ajankohta / Date:</strong>{' '}
                      {moment(event.date).format('D.M.Y [klo] HH:mm')}
                    </p>
                    ) : null}
                  {event.location ? (
                    <p>
                      <strong>Sijainti / Location:</strong>{' '}
                      <a href={`https://www.google.com/maps?q=${event.location}`}>{event.location}</a>
                    </p>
                    ) : null}
                  {event.price ? (
                    <p>
                      <strong>Hinta / Price:</strong> {event.price}
                    </p>
                    ) : null}
                  {event.webpageUrl ? (
                    <p>
                      <strong>Kotisivut / Homepage:</strong>{' '}
                      <a href={event.webpageUrl} title="Kotisivut">
                        {event.webpageUrl}
                      </a>
                    </p>
                    ) : null}
                  {event.facebookUrl ? (
                    <p>
                      <strong>Facebook-tapahtuma / Facebook event:</strong>{' '}
                      <a href={event.facebookUrl} title="Facebook-tapahtuma">
                        {event.facebookUrl}
                      </a>
                    </p>
                    ) : null}
                </div>
                <p className="description">
                  <ReactAutolinker text={event.description} options={{ newWindow: true, phone: false, mention: false, hashtag: false }} renderLink={renderLink}  />
                </p>
                <p className="description">
                  <ReactAutolinker text={event.description}
                    options={{ newWindow: true, phone: false, mention: false, hashtag: false }} />
                </p>
                {event.image ? (
                  <img src={event.image} alt="Banner" />
                  ) : null}
              </div>
              <div className="col-xs-12 col-sm-4 pull-right">
                {this.renderSignupButtons()}
                {this.renderQuotaStatus()}
              </div>
            </div>
            <div className="col-xs-12">{this.renderSignupLists()}</div>
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
