import ffmpeg from "fluent-ffmpeg";

const getVideoMetadata = (videoPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                return reject(err);
            }

            resolve(metadata);
        });
    });
};

export { getVideoMetadata };
