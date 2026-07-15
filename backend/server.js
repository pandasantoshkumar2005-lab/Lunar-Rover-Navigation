const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
app.use(cors());

// Configure Multer to keep original filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, "cv-service/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // ✅ preserves original name + extension
  }
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    console.log(req.file);
    // Forward the file to Flask CV service
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path));

    const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
      headers: formData.getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log("Node backend running on http://localhost:4000");
});
