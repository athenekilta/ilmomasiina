import React from 'react';
import nl2br from 'react-nl2br';
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
                {event.homepage ? <Link to={event.homepage}>{event.homepage}<br /></Link> : ''}
                {event.facebook ? <Link to={event.facebook}>Facebook-tapahtuma<br /></Link> : ''}
                <a href='http://pekkalammi.com'>Facebook-tapahtuma</a>
              </p>
              <p>{nl2br(event.description)}</p>
            </div>
            <div className="col-xs-12 col-sm-4 pull-right">
              <div className="sidebar-widget">
                <h3>Ilmoittaudu</h3>
                {(event.quotas ? event.quotas.map((data, index) =>
                  <SignupButton openForm={this.openForm} key={index} data={data} />) : '')}
              </div>
            </div>
            <div className="col-xs-12 col-sm-4 pull-right">
              <div className="sidebar-widget">
                <h3>Ilmoittautuneet</h3>
                {(event.quota ? event.quota.map((i, index) =>
                  <ViewProgress key={index} data={i} />) : '')}
              </div>
            </div>
            <div className="col-xs-12">
              <h2>Ilmoittautuneet</h2>
              {(event.quota ? event.quota.map((i, index) =>
                <SignupList key={index} data={i} />) : '')}
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
    date: React.PropTypes.number,
    quota: React.PropTypes.array,
  }),
};

export default SingleEvent;
