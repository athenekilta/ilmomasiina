import React from 'react';
import './SignupList.scss';

export class SignupList extends React.Component {
  render() {
    const TableRow = ({ columns, firstName, lastName, index }) =>
      <tr>
        <td>{index}.</td>
        <td>{firstName} {lastName}</td>
        {columns.map((column, i) => <td key={i}>{column}</td>)}
      </tr>;
    // console.log(this.props.rows);
    return (
      <div>
        {this.props.title ? <h3>{this.props.title}</h3> : ''}
        { !this.props.rows.length ? <p>Ei ilmoittautumisia.</p> :
        <table className='table table-condensed table-responsive'>
          <thead>
            <tr className='active'>
              <th key="position">Sija</th>
              <th key="attendee">Nimi</th>
              {this.props.headings.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {this.props.rows.map((row, i) =>
              <TableRow
                columns={row.answers.map(a => a.answer)}
                firstName={row.firstName}
                lastName={row.lastName}
                index={i + 1}
                key={i} />)}
          </tbody>
        </table>
         }
      </div>
    );
  }
}

SignupList.propTypes = {
  title: React.PropTypes.string,
  headings: React.PropTypes.array.isRequired,
  rows: React.PropTypes.array.isRequired,
};

export default SignupList;
