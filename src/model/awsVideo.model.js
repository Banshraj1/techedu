import mongoose from "mongoose";

const awsVideoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        // HLS playlist URL
        url: {
            type: String,
            required: true,
        },

        thumbnail: {
            type: String,
            required: true,
        },

        thumbnailDetails: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        videoDetails: {
            hlsUrl: {
                type: String,
                required: true,
            },

            duration: {
                type: Number,
                required: true,
            },

            size: {
                type: Number,
            },

            status: {
                type: String,
                enum: ["processing", "ready", "failed"],
                default: "processing",
            },

            bucket: {
                type: String,
            },

            region: {
                type: String,
            },

            // masterPlaylist: {
            //     type: String,
            // },
        },

        duration: {
            type: Number,
            required: true,
        },

        owner: {
            type: String,
            required: true,
        },

        isPublished: {
            type: Boolean,
            default: false,
        },

        description: {
            type: String,
        },

        rating: {
            type: Number,
            default: 0,
        },

        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],

        likescount: {
            type: Number,
            default: 0,
        },

        dislikescount: {
            type: Number,
            default: 0,
        },

        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

export const awsVideo=mongoose.model("aswVideo",awsVideoSchema);