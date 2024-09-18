import React from "react";

import { Links } from "../../components/Links/Links.js";

export default function UploadPage() {
  return (
    <div>
      <h1>Testing an upload</h1>
      <Links />
      <hr />

      <form
        action="/upload"
        method="post"
        encType="multipart/form-data"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "300px",
          margin: "2rem auto",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ position: "relative" }}>
          <input
            type="file"
            name="file"
            id="file-input"
            style={{
              position: "absolute",
              width: "0.1px",
              height: "0.1px",
              opacity: 0,
              overflow: "hidden",
              zIndex: -1,
            }}
          />
          <label
            htmlFor="file-input"
            style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              backgroundColor: "#f0f0f0",
              color: "#333",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            Choose a file
          </label>
        </div>
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            fontSize: "1.2rem", // Added larger font size
          }}
        >
          Upload Image
        </button>
        <p
          style={{
            color: "#666",
            fontSize: "0.8rem",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          Only images less than 5MB are allowed for testing.
        </p>
      </form>
    </div>
  );
}
