// import { v4 as uuidv4 } from "uuid";
// import fs from "fs";
// import { exec } from "child_process"; //watch out
// import { stdout, stderr } from "process";
// function ffmpegFxn(videoPath) {
//     const lessonId = uuidv4();
//     const outputPath = `./uploads/courses/${lessonId}`;
//     const hlsPath = `${outputPath}/index.m3u8`;
//     console.log("hls path=>", hlsPath);
//     if (!fs.existsSync(outputPath)) {
//         fs.mkdirSync(outputPath, { recursive: true });
//     }
//     // console.log(videoPath);

//     const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

//     // no queue because of POC,
//     exec(ffmpegCommand, (error, stdout, stderr) => {
//         if (error) {
//             console.log(`exec error: ${error}`);
//         }
//         // console.log(`stdout: ${stdout}`);
//         // console.log(`stderr: ${stderr}`);
//         // const videoUrl = `http:localhost:4000/uploads/courses/${lessonId}/index.m3u8`;
//     });
//     // "uploads\\courses\\7ab49f2d-314d-4cc1-ba31-5f1680053887";
//     return {
//         message: "video converted successfully",
//         folder: `uploads\\courses\\${lessonId}`,
//         videoUrl: `http:localhost:4000/uploads/courses/${lessonId}/index.m3u8`,
//         lessonId: lessonId,
//     };
// }

// export { ffmpegFxn };

import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { exec } from "child_process";

function ffmpegFxn(videoPath) {
    return new Promise((resolve, reject) => {
        const lessonId = uuidv4();

        const outputPath = `./uploads/courses/${lessonId}`;

        const hlsPath = `${outputPath}/index.m3u8`;

        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        const ffmpegCommand = `ffmpeg -i "${videoPath}" \
            -codec:v libx264 \
            -codec:a aac \
            -hls_time 10 \
            -hls_playlist_type vod \
            -hls_segment_filename "${outputPath}/segment%03d.ts" \
            -start_number 0 \
            "${hlsPath}"`;

        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }

            console.log("FFmpeg Finished");

            resolve({
                message: "video converted successfully",
                folder: outputPath,
                videoUrl: `http://localhost:4000/uploads/courses/${lessonId}/index.m3u8`,
                lessonId,
            });
        });
    });
}

export { ffmpegFxn };
