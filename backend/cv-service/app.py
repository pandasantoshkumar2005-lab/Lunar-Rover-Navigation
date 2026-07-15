from flask import Flask, request, jsonify, send_from_directory
import os
import cv2

app = Flask(__name__)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
# keep uploads inside backend/cv-service/uploads regardless of current working directory
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Read image
    img = cv2.imread(filepath)
    if img is None:
        return jsonify({"error": "Could not read image"}), 500

    height, width, channels = img.shape

    # Grayscale
    gray_filename = "gray_" + file.filename   # gray_moon.jpg
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cv2.imwrite(os.path.join(UPLOAD_FOLDER, gray_filename), gray)

    # Edge detection (default thresholds)
    edges_filename = "edges_" + file.filename  # edges_moon.jpg
    edges = cv2.Canny(gray, 100, 200)
    cv2.imwrite(os.path.join(UPLOAD_FOLDER, edges_filename), edges)

    return jsonify({
        "message": f"File {file.filename} saved successfully!",
        "dimensions": {"width": width, "height": height, "channels": channels},
        "cvResponse": {
            "original": file.filename,          # moon.jpg
            "gray_version": gray_filename,      # gray_moon.jpg
            "edges_version": edges_filename     # edges_moon.jpg
        }
    })

@app.route("/update_edges", methods=["POST"])
def update_edges():
    data = request.get_json()
    filename = data.get("filename")
    lower = int(data.get("lower", 100))
    upper = int(data.get("upper", 200))

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({"error": f"File {filename} not found"}), 404

    img = cv2.imread(filepath)
    if img is None:
        return jsonify({"error": "Could not read image"}), 500

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, lower, upper)

    edges_filename = f"edges_{lower}_{upper}_{filename}"  # edges_100_200_moon.jpg
    cv2.imwrite(os.path.join(UPLOAD_FOLDER, edges_filename), edges)

    return jsonify({
        "message": f"Edges updated with thresholds {lower}, {upper}",
        "cvResponse": {
            "original": filename,               # moon.jpg
            "gray_version": "gray_" + filename, # gray_moon.jpg
            "edges_version": edges_filename     # edges_XXX_XXX_moon.jpg
        }
    })

@app.route("/files/<filename>")
def get_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
