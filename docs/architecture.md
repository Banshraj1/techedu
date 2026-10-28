# Backend Architecture

Beginner-friendly overview of the checked-in TechEdu backend.

## Startup flow

1. Root `index.js` loads environment variables.
2. It calls `connectdb()` from `src/db/connectdb.js`.
3. After the connection promise resolves, it registers `GET /` and starts listening on `process.env.PORT`.
4. `src/App.js` configures Express middleware and mounts routers.

**Current caveat:** `connectdb()` catches and logs connection errors instead of rethrowing them, so verify startup behaviour when MongoDB is unavailable.

## Request flow

```text
Browser/client
  -> Express app (src/App.js)
  -> router (user.route.js or adminRouter.route.js)
  -> optional JWT/admin middleware and Multer
  -> controller
  -> Mongoose model / email / storage utility
  -> JSON API response
```

## Main modules

| Path                                     | Responsibility                                            |
| ---------------------------------------- | --------------------------------------------------------- |
| `src/controllers/user.controller.js`     | User registration, OTP, login/logout, profile and history |
| `src/controllers/admin.controller.js`    | Admin registration/login/logout/deletion                  |
| `src/controllers/video.contorller.js`    | Upload, video metadata, publication, rating and deletion  |
| `src/controllers/playlist.controller.js` | Playlist create/read/update/delete operations             |
| `src/routes/user.route.js`               | User endpoint paths and `verifyJwt` middleware            |
| `src/routes/adminRouter.route.js`        | Admin, video and playlist endpoint paths                  |
| `src/middleware/auth.middleware.js`      | Verifies JWT and sets `req.user` or `req.admin`           |
| `src/middleware/multer.middleware.js`    | Receives multipart upload files                           |
| `src/db/connectdb.js`                    | MongoDB connection                                        |
| `src/model/`                             | User, Admin, Video, Playlist, OTP and Comment schemas     |
| `src/email_verification/`                | OTP and welcome emails/templates                          |
| `src/upload/ffmpeg/`                     | HLS conversion and metadata extraction                    |
| `src/utils/`                             | Shared API response/error helpers, S3 and Cloudinary      |

## Data models

- **User:** username, email, phone, password hash and playlist/history references.
- **Admin:** administrator identity and credential fields, including backup password.
- **Video:** title, playback URL, thumbnail, duration, size, owner, publish state, description and rating/counters.
- **Playlist:** unique name and array of referenced video IDs.
- **OTP:** OTP value and email.
- **Comment:** comment-related model.

Mongoose schemas define the document fields and helper methods.

## Authentication

Login compares the submitted password with its stored hash, creates a JWT using `ACCESSTOKENSECRET` and expiry configuration, then sets an `accessToken` cookie. Protected middleware reads the cookie, verifies the JWT, looks up the matching user/admin and attaches it to the request.

User and admin cookie options differ in the current controllers. Test on the deployed frontend origin. The middleware also converts many token failures to a generic API error, which can make diagnosis harder.

## Implementation notes to verify

- Database variable is spelled `MONOGO_DB_URI` in code.
- CORS is configured both with manual headers and the CORS package.
- Admin registration currently has no admin-auth middleware on its route.
- OTP verification should be reviewed: ensure submitted email and OTP are matched together; the OTP model method currently checks email equality.
- Upload controller should validate both file fields before dereferencing them.
