const { createUploadthing } = require("uploadthing/server");


const f = createUploadthing();

const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete", file.url);
      return { url: file.url };
    }),
};

module.exports = { uploadRouter };
