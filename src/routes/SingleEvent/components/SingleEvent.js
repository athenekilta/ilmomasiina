import React from 'react';
import './SingleEvent.scss';

class AttendButton extends React.Component {
  render() {
    return(
      <div>
        <button className='col-md-12 btn btn-success'>{this.props.data.quotaName}</button>
      </div>
    )
  }
}

class ViewProgress extends React.Component {
  render(){
    return(
      <div>
        <p className='col-md-12'>{this.props.data.quotaName}</p>
        <div className='col-md-2'>
          <p>{this.props.data.going}/{this.props.data.max}</p>
        </div>
        <div className='progress col-md-10'>
          <div className='progress-bar' role='progressbar' aria-valuenow={this.props.data.going}
            aria-valuemin="0" aria-valuemax={this.props.data.max}
            style={{ width: this.props.data.going / this.props.data.max *100 + '%' }}>
          </div>
        </div>
      </div>
    );
  }
}

class AttendeeGroup extends React.Component {
  render () {
    const RegistrationRow = attendee =>
    <tr>
      <td>{attendee.data}</td>
      <td>{attendee.data}</td>
      <td>{attendee.data}</td>
    </tr>

    return (
      <div>
        <h3>{this.props.data.quotaName}</h3>
        <table className='table table-striped table-condensed table-responsive'>
          <thead>
            <tr>
              <th>Sija</th>
              <th>Nimi</th>
              {typeof this.props.data !== 'undefined' ? <th>Oma tsyssäri jos on</th> : null }
            </tr>
          </thead>
          <tbody>
          {
            this.props.data.attendees.map(
              (i, index) =>
                <RegistrationRow data={i} />)
          }
          </tbody>
        </table>
        <hr/>
      </div>
    )
  }
}

class SingleEvent extends React.Component {
  componentWillMount() {
    // get the event with correct id
    this.props.getEventInfo();
  }

  render() {
    return (
      <div>
        <div className='col-md-8'>
          <h1>{this.props.singleEvent.title}</h1>
          <p>
            {this.props.singleEvent.date}<br />
            Hinta: {this.props.singleEvent.price}<br />
            <a href='http://pekkalammi.com'>Facebook-tapahtuma</a>
          </p>
          <p>{this.props.singleEvent.description}</p>
          <h2>Ilmoittautuneet</h2>
          {typeof this.props.singleEvent.quota !== 'undefined' ?
          (this.props.singleEvent.quota.map(
            (i, index) =>
              <AttendeeGroup key={index} data={i} />)
            ) : '' }
        </div>
        <div className='asideComponent col-md-4 pull-right'>
          <h3 className='col-md-12'>Ilmoittaudu</h3>
          {this.props.singleEvent.quota.map(
            (i, index) =>
            <AttendButton key={index} data={i} />
          )

          }
        </div>
        <div className='asideComponent col-md-4 pull-right'>
          <h3 className='col-md-12'>Ilmoittautuneet</h3>
          {this.props.singleEvent.quota.map(
            (i, index) =>
            <ViewProgress key={index} data={i} />
            )
          }
        </div>
      </div>
    );
  }
}

AttendeeGroup.propTypes = {
  data: React.PropTypes.shape({
    quotaName: React.PropTypes.string,
    attendees: React.PropTypes.object,
  }).isRequired,
};


SingleEvent.propTypes = {
  getEventInfo: React.PropTypes.func.isRequired,
  params: React.PropTypes.shape({
    id: React.PropTypes.string,
  }).isRequired,
  singleEvent: React.PropTypes.shape({
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    price: React.PropTypes.number,
    date: React.PropTypes.number,
    quota: React.PropTypes.object,
  }),
};

export default SingleEvent;
