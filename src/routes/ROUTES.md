# TechEdu Backend API Routes

This document describes the User and Admin API routes registered in the TechEdu backend. It preserves the existing route catalogue and adds request-field notes and OTP endpoints identified in the current route definitions.

> **Important:** A route being registered does not guarantee that every request will succeed. Controller validation, database state, environment variables, and external services can affect the response. Confirm details against the controller before relying on undocumented request fields or response properties.

## Table of Contents

- [Base URLs](#base-urls)
- [User Routes](#user-routes)
    - [Authentication](#user-authentication)
    - [User Profile](#user-profile)
    - [Watch History](#watch-history)
- [Admin Routes](#admin-routes)
    - [Admin Authentication](#admin-authentication)
    - [Video Management](#video-management)
    - [Playlist Management](#playlist-management)
- [Authentication and Cookies](#authentication-and-cookies)
- [Request Examples](#request-examples)
- [Security and Maintenance Notes](#security-and-maintenance-notes)

## Base URLs

For local development, the API base paths are:

```text
User API:  http://localhost:8000/techedu/v1
Admin API: http://localhost:8000/techedu/v1/admin
```

For deployment, replace `http://localhost:8000` with the backend origin. Keep the `/techedu/v1` and `/techedu/v1/admin` prefixes as shown unless the backend route configuration changes.

# User Routes

## User Authentication

### Request OTP

| Property       | Value                        |
| -------------- | ---------------------------- |
| Method         | `POST`                       |
| Endpoint       | `/getOTP`                    |
| Authentication | Not required                 |
| Request fields | JSON body containing `email` |

```http
POST http://localhost:8000/techedu/v1/getOTP
Content-Type: application/json
```

Requests an OTP for the supplied email address. The email/OTP delivery configuration must be set up for this operation to work.

### Verify OTP

| Property       | Value                                   |
| -------------- | --------------------------------------- |
| Method         | `POST`                                  |
| Endpoint       | `/verifyOTP`                            |
| Authentication | Not required                            |
| Request fields | JSON body containing `email` and `code` |

```http
POST http://localhost:8000/techedu/v1/verifyOTP
Content-Type: application/json
```

Submits the OTP code associated with an email address for verification. Check the OTP controller/model implementation to confirm expiry, attempt limits, and matching behaviour.

### Register User

| Property       | Value                                    |
| -------------- | ---------------------------------------- |
| Method         | `POST`                                   |
| Endpoint       | `/register`                              |
| Authentication | Not required at the route level          |
| Request fields | `username`, `email`, `phone`, `password` |

```http
POST http://localhost:8000/techedu/v1/register
Content-Type: application/json
```

Creates a user account. The controller may impose additional validation and may require the email verification flow to have been completed.

### Login User

| Property       | Value               |
| -------------- | ------------------- |
| Method         | `POST`              |
| Endpoint       | `/login`            |
| Authentication | Not required        |
| Request fields | `email`, `password` |

```http
POST http://localhost:8000/techedu/v1/login
Content-Type: application/json
```

Authenticates a user and sets the login cookie when authentication succeeds.

### Logout User

| Property       | Value                           |
| -------------- | ------------------------------- |
| Method         | `GET`                           |
| Endpoint       | `/logout`                       |
| Authentication | User JWT required (`verifyJwt`) |

```http
GET http://localhost:8000/techedu/v1/logout
```

Logs out the currently authenticated user by clearing the login cookie.

### Delete User

| Property       | Value                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Method         | `POST`                                                                                                   |
| Endpoint       | `/delete`                                                                                                |
| Authentication | User JWT required (`verifyJwt`)                                                                          |
| Request fields | The controller checks account credentials; inspect its implementation for the exact required body fields |

```http
POST http://localhost:8000/techedu/v1/delete
Content-Type: application/json
```

Deletes the currently authenticated user account. This is a destructive operation; test it only with a test account.

## User Profile

### Get Current User

| Property       | Value                           |
| -------------- | ------------------------------- |
| Method         | `GET`                           |
| Endpoint       | `/get-me`                       |
| Authentication | User JWT required (`verifyJwt`) |

```http
GET http://localhost:8000/techedu/v1/get-me
```

Returns details for the currently authenticated user.

### About User

| Property       | Value                           |
| -------------- | ------------------------------- |
| Method         | `POST`                          |
| Endpoint       | `/about/:username`              |
| Authentication | User JWT required (`verifyJwt`) |
| Path parameter | `username`                      |

```http
POST http://localhost:8000/techedu/v1/about/john_doe
```

Returns profile information for the specified username. Replace `john_doe` with the username to look up.

## Watch History

### Add Video to Watch History

| Property       | Value                                                                |
| -------------- | -------------------------------------------------------------------- |
| Method         | `PATCH`                                                              |
| Endpoint       | `/watch-history/expand:videoId`                                      |
| Authentication | User JWT required (`verifyJwt`)                                      |
| Path parameter | `videoId` is appended directly after `expand` in the registered path |

```http
PATCH http://localhost:8000/techedu/v1/watch-history/expand64c1d8f9
```

Adds a video to the user's watch history.

### Remove Video from Watch History

| Property       | Value                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| Method         | `PATCH`                                                                |
| Endpoint       | `/watch-history/compress:videoId`                                      |
| Authentication | User JWT required (`verifyJwt`)                                        |
| Path parameter | `videoId` is appended directly after `compress` in the registered path |

```http
PATCH http://localhost:8000/techedu/v1/watch-history/compress64c1d8f9
```

Removes a video from the user's watch history.

# Admin Routes

Admin routes use this base path:

```text
http://localhost:8000/techedu/v1/admin
```

## Admin Authentication

### Register Admin

| Property       | Value                                                       |
| -------------- | ----------------------------------------------------------- |
| Method         | `POST`                                                      |
| Endpoint       | `/register`                                                 |
| Authentication | **Public in the current route definition**                  |
| Request fields | `adminname`, `email`, `phone`, `password`, `backupPassword` |

```http
POST http://localhost:8000/techedu/v1/admin/register
Content-Type: application/json
```

Creates an administrator account. Since this endpoint is currently public, restrict it if unrestricted admin creation is not intentional.

### Login Admin

| Property       | Value                                 |
| -------------- | ------------------------------------- |
| Method         | `POST`                                |
| Endpoint       | `/login`                              |
| Authentication | Not required                          |
| Request fields | `email`, `password`, `backupPassword` |

```http
POST http://localhost:8000/techedu/v1/admin/login
Content-Type: application/json
```

Authenticates an administrator.

### Logout Admin

| Property       | Value                                                 |
| -------------- | ----------------------------------------------------- |
| Method         | `POST`                                                |
| Endpoint       | `/logout`                                             |
| Authentication | Admin authentication middleware (`adminVerification`) |

```http
POST http://localhost:8000/techedu/v1/admin/logout
```

Logs out the currently authenticated administrator by clearing the admin login cookie.

### Delete Admin

| Property       | Value                                                 |
| -------------- | ----------------------------------------------------- |
| Method         | `DELETE`                                              |
| Endpoint       | `/delete`                                             |
| Authentication | Admin authentication middleware (`adminVerification`) |

```http
DELETE http://localhost:8000/techedu/v1/admin/delete
```

Deletes the currently authenticated administrator account. This is a destructive operation; test it only with a test account.

## Video Management

### Upload Video

| Property             | Value                                                  |
| -------------------- | ------------------------------------------------------ |
| Method               | `POST`                                                 |
| Endpoint             | `/v/upload`                                            |
| Authentication       | Admin authentication middleware plus upload middleware |
| Content type         | `multipart/form-data`                                  |
| Required form fields | `video`, `thumbnail`                                   |

```http
POST http://localhost:8000/techedu/v1/admin/v/upload
```

Uploads a video and thumbnail. The backend processes the video into HLS output and stores the resulting streaming assets in S3; the thumbnail is handled separately. See [`docs/video-processing.md`](../../docs/video-processing.md) for the processing flow and storage notes.

### Update Rating

| Property       | Value                                                 |
| -------------- | ----------------------------------------------------- |
| Method         | `PATCH`                                               |
| Endpoint       | `/v/change/rating`                                    |
| Authentication | Admin authentication middleware (`adminVerification`) |
| Request fields | `rating`, `videoId`                                   |

```http
PATCH http://localhost:8000/techedu/v1/admin/v/change/rating
Content-Type: application/json
```

Updates the rating associated with a video.

### Get Video by ID

| Property       | Value                                        |
| -------------- | -------------------------------------------- |
| Method         | `GET`                                        |
| Endpoint       | `/v/get/video/:videoId`                      |
| Authentication | Not required in the current route definition |
| Path parameter | `videoId`                                    |

```http
GET http://localhost:8000/techedu/v1/admin/v/get/video/64c1d8f9
```

Returns video details for the specified ID.

### Publish Video

| Property       | Value                                                                          |
| -------------- | ------------------------------------------------------------------------------ |
| Method         | `PATCH`                                                                        |
| Endpoint       | `/v/publish/video`                                                             |
| Authentication | Admin authentication middleware (`adminVerification`)                          |
| Request fields | Check the controller for the exact body fields, including the video identifier |

```http
PATCH http://localhost:8000/techedu/v1/admin/v/publish/video
Content-Type: application/json
```

Publishes a video and makes it available according to the application's publication logic.

### Ban Video

| Property       | Value                                                                          |
| -------------- | ------------------------------------------------------------------------------ |
| Method         | `PATCH`                                                                        |
| Endpoint       | `/v/ban/video`                                                                 |
| Authentication | Admin authentication middleware (`adminVerification`)                          |
| Request fields | Check the controller for the exact body fields, including the video identifier |

```http
PATCH http://localhost:8000/techedu/v1/admin/v/ban/video
Content-Type: application/json
```

Restricts access to a video according to the application's ban logic.

### Delete Video

| Property       | Value                                                 |
| -------------- | ----------------------------------------------------- |
| Method         | `DELETE`                                              |
| Endpoint       | `/v/delete/video`                                     |
| Authentication | Admin authentication middleware (`adminVerification`) |
| Request fields | The controller reads `videoId` from the request body  |

```http
DELETE http://localhost:8000/techedu/v1/admin/v/delete/video
Content-Type: application/json
```

Permanently deletes a video record according to the controller's deletion logic. Confirm whether associated S3 assets are also deleted before assuming all stored files are removed.

### Update Video Details

| Property       | Value                                                                             |
| -------------- | --------------------------------------------------------------------------------- |
| Method         | `PATCH`                                                                           |
| Endpoint       | `/v/update/video`                                                                 |
| Authentication | Admin authentication middleware (`adminVerification`)                             |
| Request fields | Check the controller for the exact supported metadata fields and video identifier |

```http
PATCH http://localhost:8000/techedu/v1/admin/v/update/video
Content-Type: application/json
```

Updates video metadata. Only fields supported by the controller should be sent.

## Playlist Management

### Create Playlist

| Property       | Value                                                 |
| -------------- | ----------------------------------------------------- |
| Method         | `POST`                                                |
| Endpoint       | `/p/create/playlist`                                  |
| Authentication | Admin authentication middleware (`adminVerification`) |
| Request fields | `playlistName`                                        |

```http
POST http://localhost:8000/techedu/v1/admin/p/create/playlist
Content-Type: application/json
```

Creates a playlist.

### Insert Video into Playlist

| Property       | Value                                                 |
| -------------- | ----------------------------------------------------- |
| Method         | `PATCH`                                               |
| Endpoint       | `/p/insert/video`                                     |
| Authentication | Admin authentication middleware (`adminVerification`) |
| Request fields | `playlistName`, `videoId`                             |

```http
PATCH http://localhost:8000/techedu/v1/admin/p/insert/video
Content-Type: application/json
```

Adds one video to a playlist.

### Insert Multiple Videos into Playlist

| Property       | Value                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------- |
| Method         | `PATCH`                                                                                     |
| Endpoint       | `/p/insert/videos`                                                                          |
| Authentication | Admin authentication middleware (`adminVerification`)                                       |
| Request fields | `playlistId`, `videos`; current implementation expects `videos` as a comma-separated string |

```http
PATCH http://localhost:8000/techedu/v1/admin/p/insert/videos
Content-Type: application/json
```

Adds multiple videos to a playlist. Check the controller for the exact parsing and validation rules for `videos`.

### Delete Video from Playlist

| Property       | Value                                                                   |
| -------------- | ----------------------------------------------------------------------- |
| Method         | `DELETE`                                                                |
| Endpoint       | `/p/delete/video`                                                       |
| Authentication | Admin authentication middleware (`adminVerification`)                   |
| Request fields | Check the controller for the exact playlist and video identifier fields |

```http
DELETE http://localhost:8000/techedu/v1/admin/p/delete/video
Content-Type: application/json
```

Removes a video from a playlist.

### Delete Playlist

| Property       | Value                                                        |
| -------------- | ------------------------------------------------------------ |
| Method         | `DELETE`                                                     |
| Endpoint       | `/p/delete/playlist`                                         |
| Authentication | Admin authentication middleware (`adminVerification`)        |
| Request fields | Check the controller for the exact playlist identifier field |

```http
DELETE http://localhost:8000/techedu/v1/admin/p/delete/playlist
Content-Type: application/json
```

Deletes a playlist.

### Get Playlist by ID

| Property       | Value                                        |
| -------------- | -------------------------------------------- |
| Method         | `GET`                                        |
| Endpoint       | `/p/get/playlist/:playlistId`                |
| Authentication | Not required in the current route definition |
| Path parameter | `playlistId`                                 |

```http
GET http://localhost:8000/techedu/v1/admin/p/get/playlist/64c1d8f9
```

Returns playlist details for the specified ID.

## Authentication and Cookies

- User-protected routes use the `verifyJwt` middleware.
- Admin-protected routes use the `adminVerification` middleware.
- The application uses cookies for authentication. Browser requests across origins generally need credentials enabled on the client, and the backend CORS and cookie settings must allow the frontend origin.
- Publicly accessible routes are marked as such based on the current route definitions. This does not mean the controller has no additional checks.

## Request Examples

The examples below illustrate the general JSON shapes identified in the route/controller code. Use test values and never commit real passwords, tokens, or secrets.

### Request an OTP

```json
{
    "email": "person@example.com"
}
```

### Verify an OTP

```json
{
    "email": "person@example.com",
    "code": "123456"
}
```

### Register a user

```json
{
    "username": "example_user",
    "email": "person@example.com",
    "phone": "1234567890",
    "password": "replace-with-a-test-password"
}
```

### Log in a user

```json
{
    "email": "person@example.com",
    "password": "replace-with-a-test-password"
}
```

### Register an admin

```json
{
    "adminname": "example_admin",
    "email": "admin@example.com",
    "phone": "1234567890",
    "password": "replace-with-a-test-password",
    "backupPassword": "replace-with-a-test-backup-password"
}
```

### Log in an admin

```json
{
    "email": "admin@example.com",
    "password": "replace-with-a-test-password",
    "backupPassword": "replace-with-a-test-backup-password"
}
```

## Security and Maintenance Notes

1. **Admin registration:** The route is public in the current router definition. If this is not deliberate, protect it or disable public registration before production use.
2. **OTP verification:** Review the OTP model/controller carefully to ensure that the submitted code is actually compared with the stored OTP for the same email, and that expiry and retry limits are enforced.
3. **Public video and playlist reads:** The video-by-ID and playlist-by-ID endpoints are public in the current route definition. Confirm that this matches the intended access policy for unpublished or restricted content.
4. **Destructive actions:** Test user deletion, admin deletion, and video/playlist deletion only with disposable test data.
5. **Response format:** Controllers may use the shared `ApiResponse` wrapper. Inspect `src/utils/ApiResponse.js` and the relevant controller to confirm exact response fields and status codes.
6. **Keep docs in sync:** Whenever a route method, path, middleware, or request field changes, update this file and test the endpoint again.

## Related Documentation

- [Backend README](../../README.md)
- [Architecture](../../docs/architecture.md)
- [Video processing and HLS](../../docs/video-processing.md)
- [Frontend API integration](../../../frontend/docs/api-integration.md)
