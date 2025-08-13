import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [copyText, setCopyText] = useState("Copy");

  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setUploadedUrl("");
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please choose an image");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          if (p.total) {
            setProgress(Math.round((p.loaded * 100) / p.total));
          }
        },
      });
      setUploadedUrl(res.data.url);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(uploadedUrl);
    setCopyText("Copied!");
    setTimeout(() => setCopyText("Copy"), 2000);
  };

  const handleReset = () => {
    setFile(null);
    setPreview("");
    setUploadedUrl("");
    setProgress(0);
    setIsUploading(false);
    setCopyText("Copy");
  };

  return (
    <div className="upload-container">
      <h2 className="title">📤 Upload to Cloudinary & Get Public Link</h2>

      {/* Initial UI */}
      {!uploadedUrl && (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <div className="image-frame">
              <img src={preview} alt="Preview" style={{ height: "60vh" }} />
            </div>
          )}
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
          {isUploading && progress > 0 && progress < 100 && (
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </>
      )}

      {/* After Upload Success */}
      {uploadedUrl && (
        <div className="result-section">
          <div className="image-frame">
            <img src={uploadedUrl} alt="Uploaded" style={{ height: "60vh" }} />
          </div>
          <p className="uploaded-url">{uploadedUrl}</p>
          <div className="button-row">
            <button className="copy-btn" onClick={handleCopy}>
              {copyText}
            </button>
            <button className="upload-next-btn" onClick={handleReset}>
              Upload Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
