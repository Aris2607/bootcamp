const fs = require("fs");
const xlsx = require("xlsx");

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

const uploadFileExcel = (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No file uploaded or invalid file type" });
  }

  try {
    // Load the uploaded .xlsx file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Assuming first sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Convert to object of objects
    const result = {};
    jsonData.forEach((row, index) => {
      if (index > 0) {
        // Skipping the header row
        result[`row_${index}`] = {
          first_name: row[0],
          last_name: row[1],
          email: row[2],
          phone_number: row[3],
          position_id: row[4],
          department_id: row[5],
          division_id: row[6],
          profile_picture: row[7],
        };
      }
    });

    // Return the result as JSON
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error processing file" });
  } finally {
    // Optional: Clean up the uploaded file
    fs.unlinkSync(req.file.path);
  }
};

module.exports = { uploadFile, uploadFileExcel };
