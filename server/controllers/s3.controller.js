"use strict";
const multer = require("multer");
const multerS3 = require("multer-s3");
const crypto = require("crypto");
const sharp = require("sharp");
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const heicConvert = require("heic-convert");
const exifReader = require('exif-reader');
const dotenv = require("dotenv");

require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  var metadata = await sharp(req.file.buffer).metadata();
  const exif = exifReader(metadata.exif);

  //If the file type is HEIC, convert it to JPEG
  if (req.file.mimetype === "image/heic") {
    const buffer = await convertHEICtoJPG(req.file.buffer);
    req.file.buffer = buffer;
    req.file.mimetype = "image/jpeg";
  }

  if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png") {
    return res.status(400).json({ error: "Invalid file type. Only JPEG and PNG files are allowed." });
  }

  // Get folder name from req.body
  const folderName = req.body.folder_name || "default"; // registration, team, etc.
  const uploadName = req.body.upload_name;
  const type = req.body.image_type || "player_photo";
  const randomHex = randomImageName();

  let width, height;
  if (type === "team_logo") {
    width = 300;
    height = 300;
  } else if (type === "player_photo") {
    width = 400;
    height = 500;
  } else {
    return res.status(400).json({ message: "Invalid image type" });
  }

  const resizedBuffer = await sharp(req.file.buffer)
    .resize(width, height, { fit: "cover" })
    .withMetadata({ orientation: exif.Image.Orientation})
    .toFormat("jpeg")
    .toBuffer();

  req.file.buffer = resizedBuffer;

  const fileKey = `${folderName}/${uploadName}-${randomHex}`;;
  try {
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    res.json({ image_url: imageUrl });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).json({ error: "Failed to upload image", details: error.message });
  }
};

// Test S3 Connection
const testS3Connection = async (req, res) => {
  try {
    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET,
    };

    const data = await s3.send(new ListObjectsV2Command(listParams));

    res.json({
      message: "Successfully connected to S3!",
      bucket: process.env.AWS_S3_BUCKET,
      //objects: data.Contents || [],
    });
  } catch (error) {
    console.error("Error connecting to S3:", error);
    res.status(500).json({ error: "Failed to connect to S3", details: error.message });
  }
};

const convertHEICtoJPG = async (buffer) => {
  try {
    return await heicConvert({
      buffer,
      format: "JPEG",
      quality: 0.8, // Adjust quality (0-1)
    });
  } catch (error) {
    console.error("HEIC conversion failed:", error);
    throw new Error("Failed to convert HEIC file");
  }
};
module.exports = { upload, uploadImage, testS3Connection };
