import React from 'react'
import './SingleEvent.scss'
import {Link} from 'react-router'

/* Render a single item
*/

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
    console.log(this.props.params.id);
    this.props.getEventInfo()
  }
  render(){
    return (
      <div>
        <h1>{this.props.singleEvent.name}</h1>
        <p>{this.props.singleEvent.date}<br />Hinta: {this.props.singleEvent.price}<br /><a href="http://pekkalammi.com">Facebook-tapahtuma</a></p>
        <p>{this.props.singleEvent.description}</p>
        <h2>Ilmoittautuneet</h2>
        {typeof this.props.singleEvent.quota !== 'undefined' ?
        (this.props.singleEvent.quota.map(
          (i, index) =>
            <AttendeeGroup key={index} data={i} />)
          ) : '' }
      </div>
    )
  }
}

SingleEvent.propTypes = {
}

export default SingleEvent
