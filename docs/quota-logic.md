# Quota position logic

Here is described how quotas works.

Basically *event* has 1 to n *quotas*, and quotas may have maximum amount of attendees. In addition there can be *open quota* which is shared between signups of all quotas in sign up order.

When user signs up, sign up is written database to single quota without any special checks. All the necessary checks are done when querying the signups. This allows us to remove signups and make them expire without any magical tricks.

So, signups are simply a list with timestamps and all the quotas and positions are calculated based on timestamps (sign up order).

## Position when user signs up

When user signs up, the response includes his/her position in quota, in open quota or in queue. To calculate this, following things are calculated in `server/services/signup/hooks/attachPosition.js`.

First we check current quotas maximum amount on sign ups and current *position in quota*. This is also known as *signupsBefore* value.

If there is more sign ups before than is quotas limit, then we calculate these "overflows" of each quota and minus them from open quota. Boom, we just got users *position in open quota*.

If there is more sign ups also in open quota that can be, then we calculate *position in queue* with simple substraction.

## Position when showing attendee lists

This is probably easier to understand. We just simply query for all the sign ups, and go them through in sign up order. Each sign up is positioned in right quota or in quota depending on is there any space left. After that sign up is positioned to queue.
