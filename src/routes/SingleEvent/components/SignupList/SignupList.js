import React from 'react';
import './SignupList.scss';

export class SignupList extends React.Component {
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
        <table className='table table-condensed table-responsive'>
          <thead>
            <tr className='active'>
              <th>Sija</th>
              <th>Nimi</th>
              {typeof this.props.data !== 'undefined' ? <th>Oma tsyssäri jos on</th> : null }
            </tr>
          </thead>
          <tbody>
            {
            this.props.data.attendees.map(
              i =>
                <RegistrationRow data={i} />)
          }
          </tbody>
        </table>
      </div>
    );
  }
}

SignupList.propTypes = {
  data: React.PropTypes.shape({
    quotaName: React.PropTypes.string,
    attendees: React.PropTypes.array,
  }).isRequired,
};

export default SignupList;
