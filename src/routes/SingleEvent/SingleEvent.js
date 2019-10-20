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

  componentWillMount() {
    this.props.updateEventAsync(this.props.params.id);
  }

  openForm(quota) {
    this.props.attachPositionAsync(quota.id);
    this.setState({ formOpened: true });
  }

  closeForm() {
    const close = window.confirm('Oletko varma? Menetät paikkasi jonossa, jos suljet lomakkeen nyt.');

    if (close) {
      this.props.cancelSignupAsync(this.props.signup.id, this.props.signup.editToken);
      this.setState({ formOpened: false });
    }
    this.props.updateEventAsync(this.props.event.id);
  }

  async submitForm(answers) {
    this.toastId = toast.info('Ilmoittautuminen käynnissä', {});

    const success = await this.props.completeSignupAsync(this.props.signup.id, {
      editToken: this.props.signup.editToken,
      ...answers,
    });

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
      toast.update(this.toastId, {
        render:
          'Ilmoittautuminen ei onnistunut. Tarkista, että kaikki pakolliset kentät on täytetty ja yritä uudestaan.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    }
  }

  renderSignupLists(event) {
    if (!event.quota) {
      return null;
    }

    return event.quota.map((quota, index) => {
      const signups = quota.signups.slice(0, quota.size);

      return (
        <SignupList
          title={event.quota.length > 1 ? quota.title : ''}
          questions={_.filter(event.questions, 'public')}
          rows={signups}
          key={index}
        />
      );
    });
  }

  getOpenQuotas(event) {
    if (!event.quota || !event.signupsPublic) {
      return {
        openQuota: [],
        waitList: [],
        formattedQuestions: null,
      };
    }

    const extraSignups = [];

    _.each(event.quota, (quota) => {
      _.each(quota.signups.slice(quota.size), (signup) => {
        signup.answers.push({
          questionId: 0,
          answer: quota.title,
        });
        extraSignups.push(signup);
      });
    });

    const byTimestamp = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);

    const openQuota = extraSignups.slice(0, event.openQuotaSize).sort(byTimestamp);
    const waitList = extraSignups.slice(event.openQuotaSize).sort(byTimestamp);

    const formattedQuestions = event.questions.slice();

    formattedQuestions.push({
      id: 0,
      options: null,
      public: true,
      question: 'Kiintiö',
      type: 'text',
    });

    return {
      openQuota,
      waitList,
      formattedQuestions,
    };
  }

  render() {
    const { event, signup } = this.props;

    const { openQuota, waitList, formattedQuestions } = this.getOpenQuotas(event);

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
          />
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-8">
                <h1>{event.title}</h1>
                <div className="event-heading">
                  {event.date ? (
                    <p>
                      <strong>Ajankohta:</strong> {moment(event.date).format('D.M.Y [klo] HH:mm')}
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
                <p className="description">
                  <ReactAutolinker text={event.description} options={{ newWindow: true, phone: false, mention: false, hashtag: false }} />
                </p>
              </div>
              <div className="col-xs-12 col-sm-4 pull-right">
                <div className="sidebar-widget">
                  <h3>Ilmoittautuminen</h3>
                  <p>{signupState(event.date, event.registrationStartDate, event.registrationEndDate).label}</p>
                  {event.quota
                    ? event.quota.map((quota, index) => (
                      <SignupButton
                        title={quota.title}
                        opens={event.registrationStartDate}
                        closes={event.registrationEndDate}
                        openForm={() => this.openForm(quota)}
                        isOnly={event.quota.length === 1}
                        key={index}
                        />
                      ))
                    : ''}
                </div>
                {(event.quota && event.quota.length) > 1 ? (
                  <div className="sidebar-widget">
                    <h3>Ilmoittautuneet</h3>
                    {event.quota
                      ? event.quota.map((quota, index) => (
                        <ViewProgress
                          title={quota.title}
                          value={Math.min(quota.signups.length, quota.size)}
                          max={quota.size}
                          key={index}
                          />
                        ))
                      : ''}
                    {event.openQuotaSize > 0 ? (
                      <ViewProgress title="Avoin" value={openQuota.length} max={event.openQuotaSize} key="open" />
                    ) : (
                      ''
                    )}
                    {waitList ? <p>{`Jonossa: ${waitList.length}`}</p> : null}
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="col-xs-12">
                {!event.signupsPublic ? (
                  <p>Tapahtuman vastaukset eivät ole julkisia.</p>
                ) : (
                  <div>
                    <h2>Ilmoittautuneet</h2>
                    {this.renderSignupLists(event)}
                    {event.openQuotaSize ? (
                      <SignupList
                        title={'Avoin kiintiö'}
                        questions={_.filter(formattedQuestions, 'public')}
                        rows={openQuota}
                        key={'openQuota'}
                      />
                    ) : null}
                    {waitList ? (
                      <SignupList
                        title={'Jonossa'}
                        questions={_.filter(formattedQuestions, 'public')}
                        rows={waitList}
                        key={'waitList'}
                      />
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SingleEvent);
