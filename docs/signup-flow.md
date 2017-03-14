# Signup flow (backend point of view)

Here is described how the *signup process* works in Ilmomasiina. This document mainly focuses on required HTTP requests.

1. User clicks button to sign up.
```
POST /api/signups
{ quotaId: 5 }
```
Response (if not error)
```
{
  "id": 82,
  "position": 19,
  "createdAt": "2017-02-05T22:00:23.049Z",
  "editToken": "0e5c9f77bd3ee3f838a19e41faccd883"
}
```

2. A) User fills in sign up data (name, email, answers to questions).
```
PATCH /api/signups
{
  "editToken": "0e5c9f77bd3ee3f838a19e41faccd883",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@aalto.fi",
  "answers": [
    {
      "questionId": 1,
      "answer": "My special answer"
    },
    {
      "questionId": 5,
      "answer": "Option 2"
    }
  ]
}
```

2. B) User presses cancel button.
```
DELETE /api/signups/80?editToken=0e5c9f77bd3ee3f838a19e41faccd883
```

2. C) User doesn't fill his/her information within 30 minutes. Signup disappears due to `defaultScope` used in signup model.
