import React from 'react';
import nl2br from 'react-nl2br';
import _ from 'lodash';
import moment from 'moment';
import { toast } from 'react-toastify';
import SignupButton from './SignupButton';
import SignupList from './SignupList';
import ViewProgress from './ViewProgress';
import EnrollForm from './EnrollForm';
import './SingleEvent.scss';
import allTimesMatch from '../../../utils/allTimesMatch';


class SingleEvent extends React.Component {

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
    this.props.updateEvent(this.props.params.id);
  }

  openForm(quota) {
    this.props.attachPosition(quota.id);
    this.setState({ formOpened: true });
  }

  closeForm() {
    const close = window.confirm('Oletko varma? Menetät paikkasi jonossa, jos suljet lomakkeen nyt.');

    if (close) {
      this.props.cancelSignup(this.props.signup.id, this.props.signup.editToken);
      this.setState({ formOpened: false });
    }
    this.props.updateEvent(this.props.event.id);
  }

  async submitForm(answers) {
    this.toastId = toast.info('Ilmoittautuminen käynnissä', {});

    let success = await this.props.completeSignup(
      this.props.signup.id,
      {
        editToken: this.props.signup.editToken,
        ...answers,
      },
    );

    if (success) {
      toast.update(this.toastId, {
        render: 'Ilmoittautuminen onnistui!',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      this.props.updateEvent(this.props.event.id);
      this.setState({
        formOpened: false,
      });
    }
    else {
      toast.update(this.toastId, {
        render: 'Ilmoittautuminen ei onnistunut. Tarkista että kaikki pakolliset kentät on täytetty ja yritä uudestaan.',
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
    if (!event.quota) {
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

    const openQuota = extraSignups.slice(0, event.openQuota);
    const waitList = extraSignups.slice(event.openQuota);

    const formattedQuestions = event.questions;

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

    const {
      openQuota,
      waitList,
      formattedQuestions,
    } = this.getOpenQuotas(event);

    return (
      <div>
        {this.state.formOpened ? (
          <EnrollForm
            closeForm={this.closeForm}
            submitForm={this.submitForm}
            questions={event.questions}
            signup={signup}
            loading={this.props.loading}
            error={this.props.error}
          />
        ) : (
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-8">
                  <h1>{event.title}</h1>
                  <p>
                    {event.date ? (
                      <span>
                        {moment(event.date).format('D.M.Y [klo] HH:mm')}
                        <br />
                      </span>
                    ) : (
                        ''
                      )}
                    {event.location ? (
                      <span>
                        {event.location}
                        <br />
                      </span>
                    ) : (
                        ''
                      )}
                    {event.price ? (
                      <span>
                        Hinta: {event.price}
                        <br />
                      </span>
                    ) : (
                        ''
                      )}
                    {event.homepage ? (
                      <a href={event.homepage} title="Tapahtuman kotisivut">
                        {event.homepage}
                        <br />
                      </a>
                    ) : (
                        ''
                      )}
                    {event.facebook ? (
                      <a href={event.facebook} title="Facebook-tapahtuma">
                        Facebook-tapahtuma<br />
                      </a>
                    ) : (
                        ''
                      )}
                    <a href="http://pekkalammi.com">Facebook-tapahtuma</a>
                  </p>
                  <p>{nl2br(event.description)}</p>
                </div>
                <div className="col-xs-12 col-sm-4 pull-right">
                  <div className="sidebar-widget">
                    <h3>Ilmoittautuminen</h3>
                    {event.quota
                      ? event.quota.map((quota, index) => (
                        <SignupButton
                          title={quota.title}
                          opens={quota.signupOpens}
                          closes={quota.signupCloses}
                          openForm={() => this.openForm(quota)}
                          isOnly={event.quota.length === 1}
                          // Show label if sign ups times differ or this is the last button
                          showLabel={allTimesMatch(event.quota) ? event.quota.length === index + 1 : true}
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
                      {event.openQuota > 0 ? (
                        <ViewProgress
                          title="Avoin"
                          value={openQuota.length}
                          max={event.openQuota}
                          key="open"
                        />
                      ) : (
                          ''
                        )}
                      {waitList ? (
                        <p>{'Jonossa: ' + waitList.length}</p>
                      ) : null
                      }
                    </div>
                  ) : (
                      ''
                    )}
                </div>
                <div className="col-xs-12">
                  {event.quota && !event.quota.length ? (
                    <p>Tapahtuman vastaukset eivät ole julkisia.</p>
                  ) : (
                      <div>
                        <h2>Ilmoittautuneet</h2>
                        {this.renderSignupLists(event)}
                      </div>
                    )}
                </div>
                <div className="col-xs-12">
                  <div>
                    {openQuota ? (
                      <SignupList
                        title={'Avoin kiintiö'}
                        questions={formattedQuestions}
                        rows={openQuota}
                        key={'openQuota'}
                      />
                    ) : null
                    }
                    {waitList ? (
                      <SignupList
                        title={'Jonossa'}
                        questions={formattedQuestions}
                        rows={waitList}
                        key={'waitList'}
                      />
                    ) : null
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
}

SingleEvent.propTypes = {
  updateEvent: React.PropTypes.func.isRequired,
  attachPosition: React.PropTypes.func.isRequired,
  completeSignup: React.PropTypes.func.isRequired,
  cancelSignup: React.PropTypes.func.isRequired,
  setError: React.PropTypes.func.isRequired,
  setLoading: React.PropTypes.func.isRequired,
  params: React.PropTypes.shape({
    id: React.PropTypes.string,
  }).isRequired,
  event: React.PropTypes.shape({
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    price: React.PropTypes.string,
    date: React.PropTypes.string,
    quota: React.PropTypes.array,
  }),
  signup: React.PropTypes.object,
  error: React.PropTypes.string,
  loading: React.PropTypes.bool,
};

export default SingleEvent;
