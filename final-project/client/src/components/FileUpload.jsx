import React, { useEffect, useState } from "react";
import axios from "axios";
import { createData } from "../services/Api";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validate the file type (only .xlsx or .xls)
    if (
      selectedFile &&
      (selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel")
    ) {
      setFile(selectedFile);
      setError(null); // Clear previous error
    } else {
      setError("Only Excel files (.xlsx or .xls) are allowed.");
      setFile(null); // Reset file if validation fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a valid Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/upload/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Set the JSON data in the state
      setJsonData(response.data);
      const data = response.data;
      const uploadBatch = await createData("/employees/batch", { data });

      console.log(uploadBatch);
      setError(null); // Clear error
    } catch (error) {
      setError("Error uploading file");
      console.error("Error uploading file:", error);
    }
  };

  console.log("JSON:", jsonData);

  //   useEffect(() => {
  //     if (jsonData) {
  //       // Loop through each employee (row) in the data
  //       for (let key in jsonData) {
  //         if (jsonData.hasOwnProperty(key)) {
  //           const employee = jsonData[key];

  //           console.log(employee);
  //         }
  //       }
  //     }
  //   }, [jsonData]);

  return (
    <div>
      <h1>Upload .xlsx File</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="file-input w-full max-w-xs"
        />
        <button type="submit">Upload</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {jsonData && (
        <div>
          <h2>JSON Output</h2>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
