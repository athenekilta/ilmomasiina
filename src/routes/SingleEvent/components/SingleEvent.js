import React from 'react';
import SignupButton from './SignupButton';
import SignupList from './SignupList';
import ViewProgress from './ViewProgress';
import EnrollForm from './EnrollForm';
import './SingleEvent.scss';

class SingleEvent extends React.Component {
  componentWillMount() {
    // get the event with correct id
    this.props.getEventInfo();
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
    return (
      <div>
        {this.state.formOpened ? <EnrollForm closeForm={this.closeForm} /> : '' }
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-8">
              <h1>{this.props.singleEvent.title}</h1>
              <p>
                {this.props.singleEvent.date}<br />
                Hinta: {this.props.singleEvent.price}<br />
                <a href='http://pekkalammi.com'>Facebook-tapahtuma</a>
              </p>
              <p>{this.props.singleEvent.description}</p>
            </div>
            <div className="col-xs-12 col-sm-4 pull-right">
              <div className="sidebar-widget">
                <h3>Ilmoittaudu</h3>
                {(this.props.singleEvent.quota ? this.props.singleEvent.quota.map((i, index) =>
                  <SignupButton openForm={this.openForm} key={index} data={i} />) : '')}
              </div>
            </div>
            <div className="col-xs-12 col-sm-4 pull-right">
              <div className="sidebar-widget">
                <h3>Ilmoittautuneet</h3>
                {(this.props.singleEvent.quota ? this.props.singleEvent.quota.map((i, index) =>
                  <ViewProgress key={index} data={i} />) : '')}
              </div>
            </div>
            <div className="col-xs-12">
              <h2>Ilmoittautuneet</h2>
              {(this.props.singleEvent.quota ? this.props.singleEvent.quota.map((i, index) =>
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
