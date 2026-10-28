# TechEdu Backend API

Node.js/Express backend for TechEdu, a video-streaming web application. It provides user/admin authentication, email OTP endpoints, video and playlist APIs, and an admin upload pipeline that transcodes video to HLS and stores playlist/segments in Amazon S3. Thumbnails are uploaded through Cloudinary.

- Backend repository: https://github.com/Banshraj1/techedu
- Frontend repository: https://github.com/Banshraj1/techeduFrontend
- User API prefix: `/techedu/v1`
- Admin API prefix: `/techedu/v1/admin`

> Docs are based on current checked-in code. A route being registered does not guarantee that it has been tested in production.

## Stack

Node.js (ES modules), Express 4, MongoDB/Mongoose, JWT, bcrypt, cookie-parser, CORS, Multer, Nodemailer, FFmpeg, AWS SDK S3 and Cloudinary.

## Structure

```text
backend/
├── index.js
├── src/
│   ├── App.js
│   ├── controllers/          # User, admin, video and playlist handlers
│   ├── db/connectdb.js
│   ├── email_verification/
│   ├── middleware/           # JWT/admin verification and Multer
│   ├── model/                # Mongoose schemas
│   ├── routes/               # user.route.js, adminRouter.route.js, ROUTES.md
│   ├── upload/ffmpeg/        # HLS conversion and metadata
│   └── utils/                # API helpers, Cloudinary and S3
├── uploads/                  # Local temporary/output files
└── package.json
```

## Local setup

Requirements: Node.js/npm, MongoDB, FFmpeg installed on PATH, AWS S3 access, Cloudinary configuration, and email provider credentials.

```bash
git clone https://github.com/Banshraj1/techedu.git
cd techedu
npm install
npm run dev
```

`npm run dev` runs `nodemon index.js`; `npm start` runs `node index.js`. The server uses `process.env.PORT`.

## Environment variables

The checked-in code references the following configuration. Set actual values in your local `.env` and hosting environment; never commit secrets.

| Variable/config                              | Purpose                                                             |
| -------------------------------------------- | ------------------------------------------------------------------- |
| `PORT`                                       | Server port                                                         |
| `MONOGO_DB_URI`                              | MongoDB connection string (the spelling in code is `MONOGO_DB_URI`) |
| `ACCESSTOKENSECRET`                          | JWT signing/verification secret                                     |
| `ACCESSTOKENEXPIRY`                          | JWT expiry                                                          |
| `AWS_REGION`                                 | AWS region                                                          |
| `AWS_BUCKET_NAME`                            | S3 bucket name                                                      |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | AWS credentials                                                     |
| Cloudinary configuration                     | Thumbnail upload helper                                             |
| Email/SMTP configuration                     | OTP and welcome email helpers                                       |

Check `src/utils/index.js` and `src/email_verification/email.config.js` for the exact Cloudinary/email variable names. If correcting the `MONOGO_DB_URI` spelling, update both code and deployment configuration.

## Authentication

Login handlers issue an HTTP-only `accessToken` cookie. Protected routes use `verifyJwt` for users or `adminVerification` for admins. Cross-origin browser requests require compatible CORS, HTTPS/cookie attributes, and credentials. The current CORS list includes localhost:5173 and two Vercel origins: `https://techedu-frontend.vercel.app`, `https://techedu-eta.vercel.app`.

Admin registration is public in the current route definition; restrict it if public creation is not intended. Never treat CORS as authentication.

## Video pipeline

`POST /techedu/v1/admin/v/upload` expects multipart fields `video` and `thumbnail`. The controller extracts metadata, invokes FFmpeg to create `index.m3u8` and transport-stream segments, uploads the generated files under `chapters/:lessonId/` in S3, uploads the thumbnail through Cloudinary, and stores a MongoDB video record whose `url` points to the S3 playlist.

## Documentation

- [API route reference](src/routes/ROUTES.md)
- [Architecture guide](docs/architecture.md)
- [Video processing, HLS and S3](docs/video-processing.md)
- [Frontend API integration notes](https://github.com/Banshraj1/techeduFrontend/blob/main/docs/api-integration.md)

## Troubleshooting

- MongoDB connection: verify `MONOGO_DB_URI`, network access and database permissions.
- Cookie missing: verify cookie attributes, frontend credentials and CORS origin.
- Upload failure: check Multer fields, FFmpeg installation, temporary disk space, AWS region/permissions and Cloudinary credentials.
- Playback failure: check playlist and segment URLs, object access, bucket CORS and content types.

## Security checklist

Never commit `.env`, AWS keys, JWT secrets, email credentials or Cloudinary secrets. Review diagnostic logging (especially passwords/OTPs), validate file type/size, verify both upload fields exist, and clean temporary files. Test authentication and upload/playback end-to-end before production.
