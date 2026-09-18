import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3.js";

export const uploadToS3 = async (filePath, key, contentType) => {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fs.createReadStream(filePath),
        ContentType: contentType,
    });
    await s3Client.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

