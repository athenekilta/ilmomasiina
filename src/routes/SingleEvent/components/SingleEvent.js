import React from 'react';
import nl2br from 'react-nl2br';
import _ from 'lodash';
import moment from 'moment';
import SignupButton from './SignupButton';
import SignupList from './SignupList';
import ViewProgress from './ViewProgress';
import EnrollForm from './EnrollForm';
import './SingleEvent.scss';
import allTimesMatch from '../../../utils/allTimesMatch';

class SingleEvent extends React.Component {
  componentWillMount() {
    this.props.getEventInfo(this.props.params.id);
  }

  constructor(props) {
    super(props);
    this.state = {
      formOpened: false,
    };

    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  openForm() {
    const state = this.state;
    state.formOpened = true;
    this.setState(state);
  }

  closeForm() {
    const state = this.state;
    state.formOpened = false;
    this.setState(state);
  }

  submitForm(asd) {
    console.log(asd);
    const state = this.state;
    state.formOpened = false;
    this.setState(state);
  }

  render() {
    const event = this.props.singleEvent;

    return (
      <div>
        {this.state.formOpened ? (
          <EnrollForm closeForm={this.closeForm} submitForm={this.submitForm} questions={event.questions} />
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
                        openForm={this.openForm}
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
                        value={_.sum(event.quota.map(q => Math.max(0, q.signups.length - q.size)))}
                        max={event.openQuota}
                        key="open"
                      />
                    ) : (
                      ''
                    )}
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
                    {event.quota
                      ? event.quota.map((quota, index) => (
                        <SignupList
                          title={event.quota.length > 1 ? quota.title : ''}
                          questions={_.filter(event.questions, 'public')}
                          rows={quota.signups}
                          key={index}
                          />
                        ))
                      : ''}
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

SingleEvent.propTypes = {
  getEventInfo: React.PropTypes.func.isRequired,
  params: React.PropTypes.shape({
    id: React.PropTypes.string,
  }).isRequired,
  singleEvent: React.PropTypes.shape({
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    price: React.PropTypes.string,
    date: React.PropTypes.string,
    quota: React.PropTypes.array,
  }),
};

export default SingleEvent;
