import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as AdminActions from '../../modules/admin/actions';
import UserForm from './UserForm';
import './AdminEventsList.scss';

import AdminEventListItem from './AdminEventListItem';

/* Render the list container
*/

class AdminEventList extends React.Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    getEvents: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.getEvents();
  }

  render() {
    return (
      <div className="container">
        <h1>Hallinta</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Ajankohta</th>
              <th>Tila</th>
              <th>Ilmoittautuneita</th>
              <th>Toiminnot</th>
            </tr>
          </thead>
          <tbody>
            {this.props.events.map(i => (
              <AdminEventListItem
                key={i.id}
                data={i}
                deleteEvent={this.props.deleteEvent}
                getEvents={this.props.getEvents} />
            ))}
          </tbody>
        </table>
        <Link to="/admin/edit/new" className="btn btn-default">
          + Uusi tapahtuma
        </Link>
        <h1>Luo uusi käyttäjä</h1>
        {/* <UserForm createUserAsync={this.props.createUserAsync} /> */}
      </div>
    );
  }
}

const mapDispatchToProps = {
  getEvents: AdminActions.getEventsAsync,
  deleteEvent: AdminActions.deleteEventAsync
};

const mapStateToProps = state => ({
  events: state.admin.events,
  eventsLoading: state.admin.eventsLoading,
  eventsError: state.admin.eventsError,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminEventList);
