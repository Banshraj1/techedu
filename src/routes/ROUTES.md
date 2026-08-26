# Routes Documentation

This document contains all available API routes for both **User** and **Admin** operations in the TechEdu backend.

## Table of Contents

- [User Routes](#user-routes)
  - [Authentication](#authentication)
  - [User Profile](#user-profile)
  - [Watch History](#watch-history)

- [Admin Routes](#admin-routes)
  - [Authentication](#admin-authentication)
  - [Video Management](#video-management)
  - [Playlist Management](#playlist-management)

---

# User Routes

Base URL:

```text
http://localhost:8000/techedu/v1
```

## Authentication

### Register User

| Property | Value |
|----------|---------|
| Method | `POST` |
| Endpoint | `/register` |
| Authentication | ❌ No |

```http
POST http://localhost:8000/techedu/v1/register
```

Creates a new user account.

---

### Login User

| Property | Value |
|----------|---------|
| Method | `POST` |
| Endpoint | `/login` |
| Authentication | ❌ No |

```http
POST http://localhost:8000/techedu/v1/login
```

Authenticates a user and creates a login session.

---

### Logout User

| Property | Value |
|----------|---------|
| Method | `GET` |
| Endpoint | `/logout` |
| Authentication | ✅ JWT Required |

```http
GET http://localhost:8000/techedu/v1/logout
```

Logs out the currently authenticated user.

---

### Delete User

| Property | Value |
|----------|---------|
| Method | `POST` |
| Endpoint | `/delete` |
| Authentication | ✅ JWT Required |

```http
POST http://localhost:8000/techedu/v1/delete
```

Deletes the currently authenticated user account.

---

## User Profile

### Get Current User

| Property | Value |
|----------|---------|
| Method | `GET` |
| Endpoint | `/get-me` |
| Authentication | ✅ JWT Required |

```http
GET http://localhost:8000/techedu/v1/get-me
```

Returns details of the currently logged-in user.

---

### About User

| Property | Value |
|----------|---------|
| Method | `POST` |
| Endpoint | `/about/:username` |
| Authentication | ✅ JWT Required |

```http
POST http://localhost:8000/techedu/v1/about/john_doe
```

Returns profile information of the specified user.

---

## Watch History

### Add Video To Watch History

| Property | Value |
|----------|---------|
| Method | `PATCH` |
| Endpoint | `/watch-history/expand:videoId` |
| Authentication | ✅ JWT Required |

```http
PATCH http://localhost:8000/techedu/v1/watch-history/expand64c1d8f9
```

Adds a video to the user's watch history.

---

### Remove Video From Watch History

| Property | Value |
|----------|---------|
| Method | `PATCH` |
| Endpoint | `/watch-history/compress:videoId` |
| Authentication | ✅ JWT Required |

```http
PATCH http://localhost:8000/techedu/v1/watch-history/compress64c1d8f9
```

Removes a video from the user's watch history.

---

# Admin Routes

Base URL:

```text
http://localhost:8000/techedu/v1/admin
```

<a id="admin-authentication"></a>

## Authentication

### Register Admin

| Property | Value |
|----------|---------|
| Method | `POST` |
| Endpoint | `/register` |
| Authentication | ❌ No |

```http
POST http://localhost:8000/techedu/v1/admin/register
```

Creates a new administrator account.

---

### Login Admin

| Property | Value |
|----------|---------|
| Method | `POST` |
| Endpoint | `/login` |
| Authentication | ❌ No |

```http
POST http://localhost:8000/techedu/v1/admin/login
```

Authenticates an administrator.

---

### Logout Admin

| Property | Value |
|----------|---------|
| Method | `POST` |
| Endpoint | `/logout` |
| Authentication | ✅ Admin JWT Required |

```http
POST http://localhost:8000/techedu/v1/admin/logout
```

Logs out the currently authenticated administrator.

---

### Delete Admin

| Property | Value |
|----------|---------|
| Method | `DELETE` |
| Endpoint | `/delete` |
| Authentication | ✅ Admin JWT Required |

```http
DELETE http://localhost:8000/techedu/v1/admin/delete
```

Deletes the currently authenticated administrator account.

---

# Video Management

### Upload Video

| Property | Value |
|----------|---------|
| Method | `POST` |
| Endpoint | `/v/upload` |
| Authentication | ✅ Admin JWT Required |

```http
POST http://localhost:8000/techedu/v1/admin/v/upload
```

Uploads a video and thumbnail.

#### Required Form Data

```text
thumbnail
video
```

---

### Update Rating

| Property | Value |
|----------|---------|
| Method | `PATCH` |
| Endpoint | `/v/change/rating` |
| Authentication | ✅ Admin JWT Required |

```http
PATCH http://localhost:8000/techedu/v1/admin/v/change/rating
```

Updates the rating of a video.

---

### Get Video By ID

| Property | Value |
|----------|---------|
| Method | `GET` |
| Endpoint | `/v/get/video/:videoId` |
| Authentication | ❌ No |

```http
GET http://localhost:8000/techedu/v1/admin/v/get/video/64c1d8f9
```

Returns video details by ID.

---

### Publish Video

| Property | Value |
|----------|---------|
| Method | `PATCH` |
| Endpoint | `/v/publish/video` |
| Authentication | ✅ Admin JWT Required |

```http
PATCH http://localhost:8000/techedu/v1/admin/v/publish/video
```

Publishes a video and makes it visible to users.

---

### Ban Video

| Property | Value |
|----------|---------|
| Method | `PATCH` |
| Endpoint | `/v/ban/video` |
| Authentication | ✅ Admin JWT Required |

```http
PATCH http://localhost:8000/techedu/v1/admin/v/ban/video
```

Restricts access to a video.

---

### Delete Video

| Property | Value |
|----------|---------|
| Method | `DELETE` |
| Endpoint | `/v/delete/video` |
| Authentication | ✅ Admin JWT Required |

```http
DELETE http://localhost:8000/techedu/v1/admin/v/delete/video
```

Deletes a video permanently.

---

### Update Video Details

| Property | Value |
|----------|---------|
| Method | `PATCH` |
| Endpoint | `/v/update/video` |
| Authentication | ✅ Admin JWT Required |

```http
PATCH http://localhost:8000/techedu/v1/admin/v/update/video
```

Updates video metadata and information.

---

# Playlist Management

### Create Playlist

| Property | Value |
|----------|---------|
| Method | `POST` |
| Endpoint | `/p/create/playlist` |
| Authentication | ✅ Admin JWT Required |

```http
POST http://localhost:8000/techedu/v1/admin/p/create/playlist
```

Creates a new playlist.

---

### Insert Video Into Playlist

| Property | Value |
|----------|---------|
| Method | `PATCH` |
| Endpoint | `/p/insert/video` |
| Authentication | ✅ Admin JWT Required |

```http
PATCH http://localhost:8000/techedu/v1/admin/p/insert/video
```

Adds a single video to a playlist.

---

### Insert Multiple Videos Into Playlist

| Property | Value |
|----------|---------|
| Method | `PATCH` |
| Endpoint | `/p/insert/videos` |
| Authentication | ✅ Admin JWT Required |

```http
PATCH http://localhost:8000/techedu/v1/admin/p/insert/videos
```

Adds multiple videos to a playlist.

---

### Delete Video From Playlist

| Property | Value |
|----------|---------|
| Method | `DELETE` |
| Endpoint | `/p/delete/video` |
| Authentication | ✅ Admin JWT Required |

```http
DELETE http://localhost:8000/techedu/v1/admin/p/delete/video
```

Removes a video from a playlist.

---

### Delete Playlist

| Property | Value |
|----------|---------|
| Method | `DELETE` |
| Endpoint | `/p/delete/playlist` |
| Authentication | ✅ Admin JWT Required |

```http
DELETE http://localhost:8000/techedu/v1/admin/p/delete/playlist
```

Deletes a playlist.

---

### Get Playlist By ID

| Property | Value |
|----------|---------|
| Method | `GET` |
| Endpoint | `/p/get/playlist/:playlistId` |
| Authentication | ❌ No |

```http
GET http://localhost:8000/techedu/v1/admin/p/get/playlist/64c1d8f9
```

Returns playlist details by ID.