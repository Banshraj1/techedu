import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { exec } from "child_process"; //watch out
import { stdout, stderr } from "process";

const PORT = 4000;

const app = express();

//multer

//multer middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + uuidv4() + path.extname(file.originalname),
        );
    },
});

//multer configuration
const upload = multer({ storage: storage });

app.use(
    cors({
        origin: [
            "http://localhost:4000",
            "http://localhost:3000",
            "http://localhost:5173",
        ],
        credentials: true,
    }),
);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Origin",
        "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//real world me s3 wagera pr file aata hai abhi yha bs aise hi ho rha hai
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("hello world");
});

app.post("/upload", upload.single("file"), (req, res) => {
    const lessonId = uuidv4();
    const videoPath = req.file.path;
    const outputPath = `./uploads/cources/${lessonId}`;
    const hlsPath = `${outputPath}/index.m3u8`;
    console.log("hls path=>", hlsPath);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    //ffmpeg
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    // no queue because of POC,
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`exec error: ${error}`);
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        const videoUrl = `http:localhost:4000/uploads/cources/${lessonId}/index.m3u8`;
        res.json({
            message: "video converted successfully",
            videoUrl: videoUrl,
            lessonId: lessonId,
        });
    });

    // console.log("file uploaded");
    // res.send("done");
});

app.listen(PORT, () => {
    console.log(`App is listenning over port ${PORT}`);
});
