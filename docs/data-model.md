# Data model

Ilmomasiina uses Sequelize to store data in a relational database.

## Models

```
 ╷───────┐1     *┌───────┐1     *┌────────┐
 │ Event ├───────┤ Quota ├───────┤ Signup │
 └───┬───┘       └───────┘       └────┬───┘
     │1                               │1
     │                                │
     │*                               │*
┌────┴─────┐1                   *┌────┴───┐
│ Question ├─────────────────────┤ Answer │
└──────────┘                     └────────┘


                 ┌──────┐
                 │ User │
                 └──────┘
```

### Event

**Event** instances hold most of the information of an event, including description information, registration
settings and status flags.

Events can be enumerated, viewed, modified and deleted by admins, and in a limited fashion by users.

Each Event has one or more **Quotas** and zero or more **Questions**.

### Quota

**Quota** instances are assigned to an **Event**. Quotas mostly hold their name and size.

Quotas are created, updated and deleted automatically when updating their Events.
Quotas cannot be reassigned to a different Event.

Each Quota has one **Event** and zero or more **Signups**.

### Question

**Question** instances are assigned to an **Event**. Questions hold their question, answer type, required flag and
potentially answer options.

Like Quotas, Questions are created, updated and deleted automatically when updating their Events, and cannot be
reassigned to a different Event.

Each Question has one **Event** and zero or more **Answers**.

### Signup

**Signup** instances are assigned to a **Quota**. Signup instances hold their basic fields (name/email) and their
cached quota assignment.

Signups can be enumerated and deleted per-event by admins, and in a limited fashion by users.
They can also be viewed, modified and deleted using their edit token, which is computed statelessly.

Each Signup has one **Quota** and zero or more **Answers**.
There is one for each **Question** in the associated **Event**, but the count may be mismatched if Questions
have changed.

### Answer

**Answer** instances are assigned to a **Signup** and **Question**.

Answers are included when fetching Signups. They are recreated on each update to the Signup and are completely
transparent to the API.

Each Answer has one **Signup** and one **Question**.

### User

**User** instances hold an email address and hashed password.

Users are not related to any other models. This model is only used for local login, and can be enumerated, created
and deleted by admins.

## Paranoid mode

Tables other than **User** use Sequelize's paranoid mode by default. This means their data is not deleted immediately,
only marked as deleted. The `removeDeletedData.ts` script periodically deletes this data permanently with a
configurable grace period, to allow restoration of accidentally deleted data.
