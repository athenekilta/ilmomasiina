import React from 'react';
import './SingleEvent.scss';

/* Render a single item
*/

class AttendeeGroup extends React.Component {
  render() {
    const RegistrationRow = attendee =>
      <tr>
        <td>{attendee.data}</td>
        <td>{attendee.data}</td>
        <td>{attendee.data}</td>
      </tr>;

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
              row =>
                <RegistrationRow data={row} />)
          }
          </tbody>
        </table>
        <hr />
      </div>
    );
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
