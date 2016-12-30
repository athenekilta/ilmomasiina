import React from 'react';
import nl2br from 'react-nl2br';
import _ from 'lodash';
import moment from 'moment';
import SignupButton from './SignupButton';
import SignupList from './SignupList';
import ViewProgress from './ViewProgress';
import EnrollForm from './EnrollForm';
import './SingleEvent.scss';

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

  submitForm() {
    const state = this.state;
    state.formOpened = false;
    this.setState(state);
  }
  render() {
    const event = this.props.singleEvent;

    return (
      <div>
        {this.state.formOpened ? <EnrollForm closeForm={this.closeForm} /> : '' }
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-8">
              <h1>{event.title}</h1>
              <p>
                {event.date ? <span>{ moment(event.date).format('D.M.Y [klo] HH:mm') }<br /></span> : ''}
                {event.location ? <span>{event.location}<br /></span> : ''}
                {event.price ? <span>Hinta: {event.price}<br /></span> : ''}
                {event.homepage ? <a href={event.homepage} title="Tapahtuman kotisivut">{event.homepage}<br /></a> : ''}
                {event.facebook ? <a href={event.facebook} title="Facebook-tapahtuma">Facebook-tapahtuma<br /></a> : ''}
                <a href='http://pekkalammi.com'>Facebook-tapahtuma</a>
              </p>
              <p>{nl2br(event.description)}</p>
            </div>
            <div className="col-xs-12 col-sm-4 pull-right">
              <div className="sidebar-widget">
                <h3>Ilmoittaudu</h3>
                {(event.quotas ? event.quotas.map((quota, index) =>
                  <SignupButton
                    title={quota.title}
                    opens={quota.signupOpens}
                    closes={quota.signupCloses}
                    openForm={this.openForm}
                    key={index}
                  />,
                  ) : '')}
              </div>
              <div className="sidebar-widget">
                <h3>Ilmoittautuneet</h3>
                {(event.quotas ? event.quotas.map((quota, index) =>
                  <ViewProgress title={quota.title} value={quota.going} max={quota.size} key={index} />) : '')}
              </div>
            </div>
            <div className="col-xs-12">
              {(event.quotas && !event.quotas.length ? <p>Tapahtuman vastaukset eivät ole julkisia.</p> :
              <div>
                <h2>Ilmoittautuneet</h2>
                {(event.quotas ? event.quotas.map((quota, index) =>
                  // TODO: replace _.keys() with proper headings
                  <SignupList
                    title={(event.quotas.length > 1 ? quota.title : '')}
                    headings={_.keys(quota.signups[0])}
                    rows={quota.signups}
                    key={index}
                  />,
                ) : '')}
              </div>
              )}
            </div>
          </div>
        </div>
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
