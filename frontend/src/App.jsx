import { useState } from "react";

import {
  FaRocket,
  FaImage,
  FaChartLine,
  FaRobot,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaCloudUploadAlt
} from "react-icons/fa";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lower, setLower] = useState(100);
  const [upper, setUpper] = useState(200);


  const handleAnalyzeTerrain = async () => {
  if (!file) {
    alert("Please select an image first");
    return;
  }

  setLoading(true);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:4000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);

    setResponse(data.cvResponse);
  } catch (err) {
    console.error(err);
  }

  setLoading(false);
};


const handleEdgeUpdate = async () => {
  if (!response) return;

  try {
    const res = await fetch(
      "http://127.0.0.1:5000/update_edges",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: response.original,
          lower,
          upper,
        }),
      }
    );

    const data = await res.json();

    setResponse(data.cvResponse);

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="app-bg">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar custom-navbar px-5">

        <div className="navbar-logo">

          <FaRocket className="rocket-icon"/>

          <div>

            <h3>LUNAR ROVER</h3>

            <small>Mission Control</small>

          </div>

        </div>

        <div className="nav-links">

          <a href="#">Dashboard</a>

          <a href="#">Analysis</a>

          <a href="#">Navigation</a>

          <a href="#">Mission Log</a>

        </div>

      </nav>

      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-overlay">

          <p className="hero-tag">

            AI • COMPUTER VISION

          </p>

          <h1 className="hero-title">

            LUNAR ROVER

            <br/>

            MISSION CONTROL

          </h1>

          <p className="hero-subtitle">

            AI-powered terrain analysis, crater detection,

            autonomous navigation and safe landing zone prediction

            for next-generation lunar exploration.

          </p>

          <div className="hero-buttons">

            <button className="primary-btn">

              Start Analysis

            </button>

            <button className="secondary-btn">

              Learn More

            </button>

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <div className="container mt-5">

        <div className="row g-4">

          <div className="col-lg-4">

            <div className="feature-card">

              <FaImage className="feature-icon blue"/>

              <h3>Terrain Analysis</h3>

              <p>

                Upload high-resolution lunar imagery

                for AI-powered preprocessing.

              </p>

            </div>

          </div>

          <div className="col-lg-4">

            <div className="feature-card">

              <FaChartLine className="feature-icon purple"/>

              <h3>Hazard Detection</h3>

              <p>

                Detect rocks, craters and steep

                slopes using Computer Vision.

              </p>

            </div>

          </div>

          <div className="col-lg-4">

            <div className="feature-card">

              <FaRobot className="feature-icon cyan"/>

              <h3>AI Navigation</h3>

              <p>

                Generate safe rover traversal

                paths with intelligent planning.

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ================= UPLOAD SECTION ================= */}

      <section className="container upload-section">

        <div className="upload-panel">

          <h2 className="upload-title">

            Upload Lunar Surface Image

          </h2>

          <p className="upload-subtitle">

            Upload a high-resolution lunar terrain image for
            AI-powered analysis and hazard detection.

          </p>

          <label className="upload-box">

            <FaCloudUploadAlt className="upload-icon"/>

            <h4>

              Drag & Drop Image Here

            </h4>

            <p>

              or click to browse

            </p>

            <span>

              JPG • PNG • JPEG

            </span>

            <input

              type="file"

              hidden

              onChange={(e)=>setFile(e.target.files[0])}

            />

          </label>

          {file && (

            <div className="selected-file">

              Selected File

              <strong>

                {file.name}

              </strong>

            </div>

          )}

          <button

            className="analyze-btn"

            onClick={handleAnalyzeTerrain}

            disabled={loading}

          >

            {loading ? "Analyzing Terrain..." : "Analyze Terrain"}

          </button>

        </div>

      </section>

      {/* Images Section */}
      {response && (

        <div className="container-fluid mt-5">

          <h2 className="text-center mb-4 analysis-title">
            🌙 Mission Analysis Results
          </h2>

          {/* Images */}
          <div className="row g-4">

            <div className="col-md-4">
              <div className="glass-card">
                <h5>Original Image</h5>

                <img
                  src={`http://127.0.0.1:5000/files/${response.original}?t=${Date.now()}`}                  alt="Original"
                  className="img-fluid rounded shadow"
                  style={{
                    height: "300px",
                    width: "100%",
                    objectFit: "cover"
                  }}
                />

                <a href={`http://127.0.0.1:5000/download/${response.original}`} download className="btn btn-sm btn-info mt-3">
                  Download
                </a>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-card">
                <h5>Grayscale Image</h5>

                <img
                  src={`http://127.0.0.1:5000/files/${response.gray_version}?t=${Date.now()}`}
                  alt="Gray"
                  className="img-fluid rounded shadow"
                  style={{
                    height: "300px",
                    width: "100%",
                    objectFit: "cover"
                  }}
                />

                <a href={`http://127.0.0.1:5000/download/${response.gray_version}`} download className="btn btn-sm btn-info mt-3">
                  Download
                </a>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-card">
                <h5>Edge Detection</h5>

                <img
                  src={`http://127.0.0.1:5000/files/${response.edges_version}?t=${Date.now()}`}
                  alt="Edges"
                  className="img-fluid rounded shadow"
                  style={{
                    height: "300px",
                    width: "100%",
                    objectFit: "cover"
                  }}
                />

                <a href={`http://127.0.0.1:5000/download/${response.edges_version}`} download className="btn btn-sm btn-info mt-3">
                  Download
                </a>
              </div>
            </div>

          </div>


          {/* Threshold Controls */}

          <div className="glass-card mt-5">

            <h3>⚙ Edge Detection Controls</h3>

            <div className="mt-3">

              <label className="fw-bold">
                Lower Threshold : {lower}
              </label>

              <input
                type="range"
                min="0"
                max="255"
                value={lower}
                onChange={(e) =>
                  setLower(Number(e.target.value))
                }
                className="form-range"
              />

            </div>

            <div className="mt-3">

              <label className="fw-bold">
                Upper Threshold : {upper}
              </label>

              <input
                type="range"
                min="0"
                max="255"
                value={upper}
                onChange={(e) =>
                  setUpper(Number(e.target.value))
                }
                className="form-range"
              />

            </div>

            <button
              className="btn btn-warning mt-3"
              onClick={handleEdgeUpdate}
            >
              Update Edge Detection
            </button>

          </div>


          <div className="glass-card mt-5">

            <h3>🚀 Mission Status</h3>
            
            <hr />

          <p>
            Upload Status :
            <span className="text-success fw-bold">
              {" "}Success
            </span>
          </p>

          <p>
            Navigation Status :
            <span className="text-info fw-bold">
              {" "}Safe
            </span>
          </p>

          <p>
            Hazard Level :
            <span className="text-warning fw-bold">
              {" "}Low
            </span>
          </p>

          <p>
            Confidence Score :
            <span className="text-success fw-bold">
              {" "}92%
            </span>
          </p>

          </div>

          {/* Landing Zone */}

          <div className="glass-card landing-zone mt-5">

            <h3>🛰 Recommended Landing Zone</h3>

            <p>Latitude : 23.45°N</p>

            <p>Longitude : 45.21°E</p>

            <h5 className="text-success">
              SAFE FOR ROVER DEPLOYMENT
            </h5>

          </div>

          {/* Statistics */}

          <div className="row g-4 mt-4">

            <div className="col-md-3">
              <div className="glass-card">
                <div className="stats-number">92%</div>
                <p>Terrain Safety</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="glass-card">
                <div className="stats-number">48</div>
                <p>Obstacle Density</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="glass-card">
                <div className="stats-number">LOW</div>
                <p>Hazard Risk</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="glass-card">
                <div className="stats-number">A1</div>
                <p>Best Route</p>
              </div>
            </div>

          </div>

          {/* AI Analysis */}

          <div className="glass-card ai-box mt-5 mb-5">

            <h2>🤖 AI Terrain Analysis</h2>

            <hr />

            <p>
              Surface contains moderate crater density.
              Edge detection identifies safe navigation
              regions with lower obstacle concentration.
            </p>

            <p>
              The recommended route minimizes collision
              risk and improves mission success probability.
            </p>

            <p>
              Terrain safety score suggests the rover can
              safely traverse the highlighted region.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;