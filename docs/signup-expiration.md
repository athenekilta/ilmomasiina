# Sign up expiration

If user clicks sign up button, but never fills his contact details (and so finishes his/her sign up), sign up is considered as *expired*. From end users point of view, these kind of sign ups doesn't exist.

## How are expired sign ups removed?

Actually we don't remove empty sign ups from the database. In sign up model is defined `defaultScope` that removes sign ups older than 30 minutes without contact details (name, email etc) saved. Check `server/models/signups.js` for more details.

## What needs to be done?

At this moment, when sign ups expires or is canceleld there is no email notification to user that gets his/her place. This is probably going to be done with simple cron job or something like that.
