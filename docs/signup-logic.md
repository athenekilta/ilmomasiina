# Signup logic

This document describes the logic and flow of registering to an event.

## Quota rules

Each **Event** has one or more **Quotas**. Each **Quota** has a specific size.

In addition, the event may have an **open quota** which is specified by its size in the **Event**'s details.

When a user signs up, their **Signup** is attached to a single **Quota** instance (never the open quota).

- The first *size* signups in a Quota (ordered by creation timestamp) are assigned to that Quota.
- The first *openQuotaSize* signups that did not fit in their respective Quotas, ordered together by creation
  timestamp, are assigned to the open quota.
- The rest of the signups are assigned to the queue.

## Position computation

When a signup is created, `computeSignupPosition.ts` computes the user's position on the *server side*.

When users or admins list all signups for an Event, the positions are computed on the *client side*.
**(This will change in the future.)**

Both computations are performed dynamically based on the information in the database.
**(This will change in the future.)**

## Expired signups

Signups expire after not being confirmed for 30 minutes. They immediately stop matching Signup's `defaultScope`
and stop being visible to users.

Following this, the `deleteUnconfirmedSignups.ts` cron job will delete them.

Currently, expiration does not cause queue notifications to be sent. **(This will change in the future.)**

## Signup flow

```
                                          ╔═══════╗
                                          ║ START ║
                                          ╚═══╤═══╝
                                              │
                                ┌─────────────┴────────────┐
                                │ User clicks quota button │
                                └─────────────┬────────────┘
                                              │
                               ╔══════════════╧══════════════╗
                               ║ POST /api/signups/<quotaId> ║
                               ╚══════════════╤══════════════╝
                                              │
                              ┌───────────────┴────────────────┐
                              │    User receives edit token    │
                              │ and quota position information │
                              └───────────────┬────────────────┘
                                              │
                ┌─────────────────────────────┼──────────────────────────────┐
                │                             │                              │
    ┌───────────┴──────────┐       ┌──────────┴─────────┐          ┌─────────┴─────────┐
    │ User submits answers │       │ User clicks cancel │          │ User does nothing │
    └───────────┬──────────┘       └──────────┬─────────┘          └─────────┬─────────┘
                │                             │                              │
   ╔════════════╧════════════╗   ╔════════════╧═════════════╗   ┌────────────┴────────────┐
   ║ PATCH /api/signups/<id> ║   ║ DELETE /api/signups/<id> ║   │ Unconfirmed signup goes │
   ╚════════════╤════════════╝   ╚════════════╤═════════════╝   │   out of defaultScope   │
                │                             │                 └────────────┬────────────┘
   ┌────────────┴────────────┐                │                              │
   │ Confirmation email sent │                │                 ┌────────────┴─────────────┐
   └────────────┬────────────┘                │                 │ deleteUnconfirmedSignups │
                │                             │                 │      cron job fires      │
   ┌────────────┴───────────┐                 │                 └────────────┬─────────────┘
   │ (Admin deletes signup) │                 │                              │
   └────────────┬───────────┘                 │                              │
                │                             │                              │
╔═══════════════╧════════════════╗            │                              │
║ DELETE /api/admin/signups/<id> ║            │                              │
╚═══════════════╤════════════════╝            │                              │
                │                             │                              │
                └─────────────────────────────┼─ ─ ─ ─ ─ ─ ─ (*) ─ ─ ─ ─ ─ ─ ┘
                                              │
                                 ┌────────────┴────────────┐
                                 │ Notification email sent │
                                 │ to next signup in queue │
                                 └─────────────────────────┘
```

(*) The notification emails are currently not sent here. **(This will change in the future.)**
