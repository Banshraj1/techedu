# Video Processing, HLS and S3

This describes the upload pipeline implemented in `src/controllers/video.contorller.js` and `src/upload/ffmpeg/`.

## Upload sequence

1. Admin sends multipart `POST /techedu/v1/admin/v/upload`.
2. Route runs `adminVerification`, then Multer for one `video` and one `thumbnail`.
3. Controller reads the local video/thumbnail paths and extracts source metadata.
4. `ffmpegFxn()` creates a unique `lessonId` and runs FFmpeg to generate `index.m3u8` and segment files such as `segment000.ts`.
5. Each generated output file is uploaded to S3 under `chapters/:lessonId/`.
6. Thumbnail is uploaded to Cloudinary.
7. A MongoDB Video record is saved with a playback URL ending in `/chapters/:lessonId/index.m3u8`.
8. Response includes `lessonId`, `playbackUrl` and the created video record inside the shared API response wrapper.

## Multipart fields and metadata

| Field         | Purpose                                         |
| ------------- | ----------------------------------------------- |
| `video`       | Source video to transcode                       |
| `thumbnail`   | Thumbnail image                                 |
| `title`       | Title; controller supplies a generated fallback |
| `owner`       | Required by controller                          |
| `description` | Defaults to `No description`                    |
| `isPublished` | Defaults to `false`                             |

The route uses Multer field names `video` and `thumbnail`. The controller currently reads metadata before validating that the video file exists, so missing-file validation should be improved.

## S3 object layout

```text
s3://<AWS_BUCKET_NAME>/chapters/<lessonId>/index.m3u8
s3://<AWS_BUCKET_NAME>/chapters/<lessonId>/segment000.ts
s3://<AWS_BUCKET_NAME>/chapters/<lessonId>/segment001.ts
...
```

The persisted playback URL is built using `AWS_BUCKET_NAME` and `AWS_REGION`. Ensure the playlist and every referenced segment are accessible from the browser. Bucket/object permissions and S3 CORS must match the intended delivery approach.

## HLS in simple terms

HLS splits a video into smaller media segments and creates a playlist that tells the player which segments to request. The frontend fetches a video record, passes its `url` through `WatchPage` and `WatchVideo`, then into `MyPlayer`. The URL currently stored by the backend points to the HLS playlist.

## Runtime requirements and production checks

- FFmpeg must be installed and available to the backend process.
- Ensure enough temporary disk space and request timeout for large videos.
- AWS credentials must allow writing objects to the configured bucket and the region must match.
- Cloudinary configuration must be available for thumbnail upload.
- The current controller processes the upload synchronously within the request; a background job/queue may be more resilient for large files.
- Upload helper uses the HLS MIME type for `.m3u8` and `video/mp2t` for other output files. Verify output directory contains only intended HLS assets.
- Add cleanup for local source and transcoded files to prevent disk usage growth.
- Validate file types/sizes and explicitly check both Multer fields before reading paths.
- A local localhost URL returned by the FFmpeg helper is not the deployed playback URL; the controller persists the S3 URL.
