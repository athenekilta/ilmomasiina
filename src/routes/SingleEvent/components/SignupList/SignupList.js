import React from 'react';
import _ from 'lodash';
import './SignupList.scss';

export class SignupList extends React.Component {
  render() {
    const TableRow = ({ answers, firstName, lastName, index }) =>
      <tr>
        <td>{index}.</td>
        <td>{firstName} {lastName}</td>
        {this.props.questions.map((q, i) => <td key={i}>{_.find(answers, { questionId: q.id }).answer}</td>)}
      </tr>;

    // console.log(this.props.rows);

    return (
      <div className="quota">
        {this.props.title ? <h3>{this.props.title}</h3> : ''}
        { !this.props.rows.length ? <p>Ei ilmoittautumisia.</p> :
        <table className='table table-condensed table-responsive'>
          <thead>
            <tr className='active'>
              <th key="position">Sija</th>
              <th key="attendee">Nimi</th>
              {this.props.questions.map((q, i) => <th key={i}>{q.question}</th>)}
            </tr>
          </thead>
          <tbody>
            {this.props.rows.map((row, i) =>
              <TableRow
                answers={row.answers}
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
  questions: React.PropTypes.array.isRequired,
  rows: React.PropTypes.array.isRequired,
};

export default SignupList;
