# api reference

base url: `http://localhost:4000/api` in dev. all requests and responses are json. errors come
back as `{ "error": "message" }`.

auth works with an httpOnly cookie named `token`. it holds an HS256 jwt that expires in 7 days.
the algorithm is pinned at verify time. send `credentials: "include"` from the browser.

## auth

| method | path | body | notes |
|---|---|---|---|
| POST | /auth/register | name, email, password | password needs 8+ chars. returns 201 and signs you in. 409 if the email exists |
| POST | /auth/login | email, password | wrong email and wrong password return the same 401 message |
| POST | /auth/logout | - | clears the cookie |
| GET | /auth/me | - | returns the current user, or 401 |
| PATCH | /auth/me | name?, email? | edit your profile. 409 if the new email is taken |
| PUT | /auth/me/password | current, password | checks the current password first. 401 if wrong |
| DELETE | /auth/me | - | deletes your account, its clients and filings. clears the cookie |

every user response looks like this:

```json
{ "userId": "cmt5...", "email": "aarti@kumarassociates.in", "name": "Aarti Kumar", "role": "USER" }
```

## clients

all routes need a signed in user. you only ever see your own clients.

| method | path | body | notes |
|---|---|---|---|
| GET | /clients | - | newest first, each with `total` and `overdue` filing counts |
| POST | /clients | name, gstin? | gstin must match the 15 char format if sent |
| DELETE | /clients/:id | - | deletes the client and its filings. 404 if not yours |

## filings

all routes need a signed in user. access goes through the parent client, so you can only touch
filings that belong to your clients. not-found returns 404, never 403, so ids can't be probed.

status is not stored. it comes from the dates at read time:

- `FILED` when filedAt is set
- `OVERDUE` when dueDate is past and filedAt is empty
- `UPCOMING` otherwise

| method | path | body | notes |
|---|---|---|---|
| GET | /filings | - | all your filings, oldest due date first, client name included |
| POST | /filings | clientId, title, period?, dueDate | dueDate is a date string |
| PATCH | /filings/:id/filed | - | sets filedAt to now |
| DELETE | /filings/:id | - | 404 if not yours |

## admin

these routes need a user with role ADMIN. everyone else gets 403.

| method | path | notes |
|---|---|---|
| GET | /admin/users | every user with name, email, role, createdAt and client count |
| DELETE | /admin/users/:id | removes a user and their data. you cannot delete yourself |

## ai insights

| method | path | notes |
|---|---|---|
| POST | /insights | needs `GROQ_API_KEY` in the backend env. returns `{ summary, risks }` |

the endpoint reads all of your filings, works out their statuses, and sends a compact text
version to groq qwen3.6-27b. the model must answer with json: one or two summary sentences and
up to 4 urgent risks, each with a client, a filing and a short note. the response is shape
checked before it reaches you. results are cached for 10 minutes per user, so refreshing is
cheap. if the model call fails you get a 502 with a plain error.
