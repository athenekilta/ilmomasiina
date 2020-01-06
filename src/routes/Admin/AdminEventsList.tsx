import React, { useState, useEffect } from "react";

import _ from "lodash";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getEventsAsync,
  deleteEventAsync,
  createUserAsync
} from "../../modules/admin/actions";
import {
  eventsError,
  eventsLoading,
  getEvents
} from "../../modules/admin/selectors";
import AdminEventListItem from "./AdminEventListItem";
import UserForm from "./UserForm";

import "./AdminEventsList.scss";
import { AppState } from "../../store/types";
import { Event } from "../../modules/types";

async function minDelay(func, ms = 1000) {
  const res = await Promise.all([
    func,
    new Promise(resolve => setTimeout(resolve, ms))
  ]);
  return res[0];
}

interface AdminEventistProps {}

type Props = AdminEventistProps & LinkStateProps & LinkDispatchProps;

const AdminEventList = (props: Props) => {
  const {
    events,
    eventsLoading,
    eventsError,
    updateEvents,
    deleteEvent,
    createUserAsync
  } = props;
  const [userFormLoading, setUserFormLoading] = useState(false);

  useEffect(() => {
    updateEvents();
  }, []);

  function createUser(email: string) {
    this.setState(
      {
        userFormLoading: true
      },
      async () => {
        try {
          // TODO: better error handling
          const success = await minDelay(createUserAsync({ email }), 1000);
          if (success) {
            toast.success("Käyttäjän luominen onnistui,", { autoClose: 2000 });
          } else {
            toast.error("Käyttäjän luominen epäonnistui.", { autoClose: 2000 });
          }
        } catch (error) {
          toast.error("Käyttäjän luominen epäonnistui.", { autoClose: 2000 });
        }

        setUserFormLoading(false);
      }
    );
  }

  function onDeleteEvent(eventId) {
    if (
      window.confirm(
        "Haluatko varmasti poistaa tämän tapahtuman? Tätä toimintoa ei voi perua."
      )
    ) {
      deleteEvent(eventId).then(success => {
        if (!success) {
          console.alert("Poisto epäonnistui :(");
        }
        updateEvents();
      });
    }
  }

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
          {_.map(events, (e: Event) => (
            <AdminEventListItem
              key={e.id}
              signups={_.sum(_.map(e.quota, q => q.signupCount))}
              data={e}
              onDelete={onDeleteEvent}
            />
          ))}
        </tbody>
      </table>
      <Link to={`${PREFIX_URL}/admin/edit/new`} className="btn btn-default">
        + Uusi tapahtuma
      </Link>
      <h1>Luo uusi käyttäjä</h1>
      <UserForm onSubmit={createUser} loading={userFormLoading} />
    </div>
  );
};

interface LinkStateProps {
  events: (state: AppState) => Event[];
  eventsLoading: (state: AppState) => boolean;
  eventsError: (state: AppState) => boolean;
}

interface LinkDispatchProps {
  updateEvents: () => void;
  deleteEvent: (eventId: string) => Promise<boolean>;
  createUserAsync: (data: { email: string }) => Promise<boolean>;
}

const mapStateToProps = (state: AppState) => ({
  events: getEvents(state),
  eventsLoading: eventsLoading(state),
  eventsError: eventsError(state)
});

const mapDispatchToProps = {
  updateEvents: getEventsAsync,
  deleteEvent: deleteEventAsync,
  createUserAsync: createUserAsync
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminEventList);
