// controllers/uploadController.js
const uploadFile = (req, res) => {
  try {
    // Jika file berhasil diupload
    console.log(req.file); // Informasi file yang diupload
    res
      .status(200)
      .json({ data: req.file, message: "File uploaded successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error uploading file", error: err.message });
  }
};

module.exports = { uploadFile };
