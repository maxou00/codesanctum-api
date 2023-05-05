import { S3 } from "aws-sdk";
import IoRedis from "ioredis";

export function getS3Client(): [first: any, second: S3] {
    let client = new S3({
        signatureVersion: "v4",
        credentials: {
            accessKeyId: process.env.BUCKET_ACCESS_KEY || "",
            secretAccessKey: process.env.BUCKET_ACCESS_SECRET || ""
        },
        endpoint: process.env.BUCKET_ENDPOINT,
        s3BucketEndpoint: true,
    });
    let conf = {
        bucketName: process.env.BUCKET_NAME,
        bucketUrl: process.env.BUCKET_ENDPOINT,
        bucketPublicUrl: process.env.BUCKET_PUBLIC_URL,
        accessKey: process.env.BUCKET_ACCESS_KEY,
        accessSecret: process.env.BUCKET_ACCESS_SECRET
    }
    return [conf, client];
}


export function getRedisClient() {
    if (!global.redis) {
        let client = new IoRedis({ host: "redis", port: 6379 });
        global.redis = client;
    }
    return global.redis
}