import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SignupList from './SignupList';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../Editor.scss';
import { CSVLink } from "react-csv";

class SignupsTab extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
    event: PropTypes.object,
    openQuotaData: PropTypes.object
  };
  renderSignupLists(event) {
    if (!event.quota) {
      return null;
    }
    return event.quota.map((quota, index) => {
      const signups = quota.signups.slice(0, quota.size);

      return (
        <SignupList
          title={event.quota.length > 1 ? quota.title : ''}
          questions={event.questions}
          rows={signups}
          key={index}
        />
      );
    });
  }
  render() {
    const { event, signups } = this.props
    const { openQuota, formattedQuestions } = this.props.openQuotaData
    return (
      <div>
        <CSVLink
          data={signups}
          filename={this.props.event.title + " osallistujalista"}>Lataa osallistujalista</CSVLink>
        {this.renderSignupLists(this.props.event)}
        {event.openQuotaSize ? (
          <SignupList
            title={'Avoin kiintiö'}
            questions={_.filter(formattedQuestions, 'public')}
            rows={openQuota}
            key={'openQuota'}
          />
        ) : null}
      </div>
    );
  }
}

export default SignupsTab;
