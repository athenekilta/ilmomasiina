import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './Editor.scss';


class SignupsTab extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
    event: PropTypes.object,
  };

  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { questions, quota } = this.props.event;

    const data = quota.flatMap(q => q.signups.map((signup) => {
      const base = {
        firstName: signup.firstName,
        lastName: signup.lastName,
        timestamp: signup.createdAt,
        quota: q.title,
      };

      const answers = Object.assign(...signup.answers.map(answer => ({
        [`answer${answer.questionId}`]: answer.answer,
      })));

      return { ...base, ...answers };
    }));

    console.log(data);

    const baseColumns = [{
      Header: 'Kiintiö',
      accessor: 'quota',
    },
    {
      Header: 'Etunimi',
      accessor: 'firstName',
    },
    {
      Header: 'Sukunimi',
      accessor: 'lastName',
    },
    {
      Header: 'Ilmoittautumisaika',
      accessor: 'timestamp',
    }];

    const columns = baseColumns.concat(questions.map(q => ({ Header: q.question, accessor: `answer${q.id}` })));

    console.log(columns);

    return <ReactTable
      data={data}
      columns={columns}
      defaultPageSize={100}
    />;

    return <b>asd</b>;
  }
}

export default SignupsTab;
