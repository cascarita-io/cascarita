"use strict";

const express = require("express");
const { upload, uploadImage, testS3Connection } = require("../controllers/s3.controller");

const router = express.Router();

module.exports = (checkJwt) => {
    // API Route for Image Upload
    router.post("/upload", upload.single("image"), uploadImage);
    router.get("/testbucket", testS3Connection);

    return router;
}