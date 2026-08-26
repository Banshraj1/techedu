function ffmpegFxn({ videoPath }) {
    const lessonId = uuidv4();
    const outputPath = `./uploads/cources/${lessonId}`;
    const hlsPath = `${outputPath}/index.m3u8`;
    console.log("hls path=>", hlsPath);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;


    // no queue because of POC,
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`exec error: ${error}`);
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        const videoUrl = `http:localhost:4000/uploads/cources/${lessonId}/index.m3u8`;
    });

    return {
        message: "video converted successfully",
        videoUrl: `http:localhost:4000/uploads/cources/${lessonId}/index.m3u8`,
        lessonId: lessonId,
    };
}

export {ffmpegFxn}