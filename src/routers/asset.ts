import { Router } from "express";
import { v4 } from "uuid";
import { join } from "path";
import { getS3Client } from "../core/utils";
import { config } from "dotenv";

const AssetRouter = Router();

AssetRouter.get("/upload", async (req, res) => {
    let fileName = req.query.name as string;
    if (fileName) {
        let uniqueName = v4() + fileName.toLowerCase();
        let finalName = join("public", uniqueName);
        let [s3Config, client] = getS3Client();

        let uploadUrl = client.getSignedUrl("putObject", {
            Bucket: s3Config.bucketName || "",
            Key: finalName,
            Expires: 30 * 60 /// 30 minutes,
        });
        let downloadUrl = `${s3Config.bucketPublicUrl}/${finalName}`;

        return res.json({
            success: true,
            uploadUrl,
            downloadUrl,
            uniqueName,
            filePath: finalName
        });
    }
    return res.status(400).json({
        success: false
    });
});

export default AssetRouter;