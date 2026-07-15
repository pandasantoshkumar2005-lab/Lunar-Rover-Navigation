import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [lower, setLower] = useState(100);
  const [upper, setUpper] = useState(200);
  const [view, setView] = useState("all"); // "all", "original", "gray", "edges"

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:4000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResponse(data);
  };

  const handleEdgeUpdate = async () => {
    if (!response) return;

    const res = await fetch("http://127.0.0.1:5000/update_edges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: response.cvResponse.original, // moon.jpg
        lower,
        upper,
      }),
    });

    const data = await res.json();
    setResponse(data); // update state with new response
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-dark text-white">
          <h2 className="mb-0">🚀 Lunar Rover Upload</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button className="btn btn-primary" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>

      {response && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-info text-white">
            <h4>Server Response</h4>
          </div>
          <div className="card-body">
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        </div>
      )}

      {response && response.cvResponse && (
        <>
          {/* Sliders for edge detection */}
          <div className="card mt-4 p-3 shadow-sm">
            <h5>⚙️ Adjust Edge Detection</h5>
            <label>Lower Threshold: {lower}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={lower}
              onChange={(e) => setLower(Number(e.target.value))}
              className="form-range"
            />
            <label>Upper Threshold: {upper}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={upper}
              onChange={(e) => setUpper(Number(e.target.value))}
              className="form-range"
            />
            <button className="btn btn-secondary mt-2" onClick={handleEdgeUpdate}>
              Update Edge Detection
            </button>
          </div>

          {/* View toggle */}
          <div className="btn-group mt-3">
            <button onClick={() => setView("all")} className="btn btn-outline-primary">All Views</button>
            <button onClick={() => setView("original")} className="btn btn-outline-secondary">Original</button>
            <button onClick={() => setView("gray")} className="btn btn-outline-dark">Grayscale</button>
            <button onClick={() => setView("edges")} className="btn btn-outline-success">Edges</button>
          </div>

          {/* Image display */}
          <div className="row mt-4">
            {(view === "all" || view === "original") && (
              <div className="col-md-4 text-center">
                <h5>Original Image</h5>
                <img src={`http://127.0.0.1:5000/files/${response.cvResponse.original}?t=${Date.now()}`} alt="Original" />
              </div>
            )}
            {(view === "all" || view === "gray") && (
              <div className="col-md-4 text-center">
                <h5>Grayscale Image</h5>
                <img src={`http://127.0.0.1:5000/files/${response.cvResponse.gray_version}?t=${Date.now()}`} alt="Grayscale" />
              </div>
            )}
            {(view === "all" || view === "edges") && (
              <div className="col-md-4 text-center">
                <h5>Edges Detected</h5>
                <img src={`http://127.0.0.1:5000/files/${response.cvResponse.edges_version}?t=${Date.now()}`} alt="Edges" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
