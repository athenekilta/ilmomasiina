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

The quota assignment and position of signups is stored in the database.

`computeSignupPosition.ts` can be called to refresh the assignments and positions of all signups in an event.
This code is idempotent and:
- Computes new statuses based on the above rules
- Stores changed statuses in the database
- Sends notifications to signups that moved out of the queue

This computation locks the Event in the database to ensure no changes are made during it, including overlapping
refreshes. This may be a performance bottleneck - in the future, these updates may be batched to avoid waiting on
locks, but such a change is not trivial due to transactions.

The following actions currently trigger a refresh:
- Creation of new signup (`POST /api/signups`)
- Expiration of signups (`deleteUnconfirmedSignups.ts`)
- Deletion of signups by user or admin (`DELETE /api/signups/<id>`)
- Any modifications on the event (`UPDATE /api/admin/events/<id>`)

## Expired signups

Signups expire after not being confirmed for 30 minutes. They immediately stop matching Signup's `defaultScope`
and stop being visible to users.

Following this, the `deleteUnconfirmedSignups.ts` cron job will delete them and trigger a state refresh.

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
                                    ╔═════════╧═════════╗
                                    ║ POST /api/signups ║
                                    ╚═════════╤═════════╝
                                              │
                              ┌───────────────┴────────────────┐
                              │    User receives edit token    │
                              │ and quota position information │
                              └───────────────┬────────────────┘
                                              │
                ┌─────────────────────────────┴──────┬───────────────────────┐
                │                                    │                       │
    ┌───────────┴──────────┐                         │             ┌─────────┴─────────┐
    │ User submits answers │                         │             │ User does nothing │
    └───────────┬──────────┘                         │             └─────────┬─────────┘
                │                                    │                       │
   ╔════════════╧════════════╗                       │          ┌────────────┴────────────┐
   ║ PATCH /api/signups/<id> ║                       │          │ Unconfirmed signup goes │
   ╚════════════╤════════════╝                       │          │   out of defaultScope   │
                │                                    │          └────────────┬────────────┘
   ┌────────────┴────────────┐                       │                       │
   │ Confirmation email sent │                       │          ┌────────────┴─────────────┐
   └────────────┬────────────┘                       │          │ deleteUnconfirmedSignups │
                │                                    │          │      cron job fires      │
                ├────────────────────────────┐       │          └────────────┬─────────────┘
                │                            │       │                       │
   ┌────────────┴───────────┐         ┌──────┴───────┴──────┐                │
   │  Admin deletes signup  │         │ User cancels signup │                │
   └────────────┬───────────┘         └──────────┬──────────┘                │
                │                                │                           │
╔═══════════════╧════════════════╗  ╔════════════╧═════════════╗             │
║ DELETE /api/admin/signups/<id> ║  ║ DELETE /api/signups/<id> ║             │
╚═══════════════╤════════════════╝  ╚════════════╤═════════════╝             │
                │                                │                           │
                └─────────────────────────────┬──┴───────────────────────────┘
                                              │
                                 ┌────────────┴────────────┐
                                 │ Notification email sent │
                                 │ to next signup in queue │
                                 └─────────────────────────┘
```
