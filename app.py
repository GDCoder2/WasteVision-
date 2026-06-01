from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from transformers import AutoModelForImageClassification, AutoImageProcessor
from PIL import Image
import torch
import numpy as np
import cv2
import base64
import json

app = Flask(__name__, static_folder="Frontend", static_url_path="")
CORS(app)

# -------------------- LOAD MODEL --------------------
model = AutoModelForImageClassification.from_pretrained("Waste_ViT_model")
processor = AutoImageProcessor.from_pretrained("Waste_ViT_model")

with open("Waste_ViT_model/labels.json") as f:
    id2label = json.load(f)

model.eval()

# -------------------- GRAD-CAM (ViT) --------------------
def vit_gradcam(model, inputs):

    outputs = model(**inputs, output_hidden_states=True)
    logits = outputs.logits
    hidden_states = outputs.hidden_states[-1]  # (1, 197, 768)

    pred_index = torch.argmax(logits, dim=1)

    # Compute gradients
    grads = torch.autograd.grad(
        outputs=logits[:, pred_index],
        inputs=hidden_states,
        grad_outputs=torch.ones_like(logits[:, pred_index]),
        retain_graph=True
    )[0]  # (1, 197, 768)

    # Remove CLS token
    grads = grads[:, 1:, :]            # (1, 196, 768)
    hidden_states = hidden_states[:, 1:, :]  # (1, 196, 768)

    # Compute weights
    weights = grads.mean(dim=2)        # (1, 196)

    # Weighted sum
    cam = (weights.unsqueeze(-1) * hidden_states).sum(dim=2)  # (1, 196)

    cam = cam[0].detach().cpu().numpy()

    # Normalize
    cam = np.maximum(cam, 0)
    cam = cam / (cam.max() + 1e-8)

    # Reshape to 14x14 (since 224/16 = 14)
    cam = cam.reshape(14, 14)

    return cam

# -------------------- HEATMAP --------------------
def generate_gradcam_image(img, heatmap):

    img = np.array(img.resize((224, 224)))

    heatmap = cv2.resize(heatmap, (224, 224))
    heatmap = np.uint8(255 * heatmap)
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = heatmap_color * 0.4 + img

    return overlay.astype("uint8")

# -------------------- BASE64 --------------------
def image_to_base64(img):
    _, buffer = cv2.imencode('.jpg', img)
    return base64.b64encode(buffer).decode('utf-8')

# -------------------- HOME ROUTE --------------------
@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_frontend(path):
    return send_from_directory(app.static_folder, path)

# -------------------- PREDICT ROUTE --------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        file = request.files["file"]
        img = Image.open(file).convert("RGB")

        inputs = processor(images=img, return_tensors="pt")

        # Enable gradients for Grad-CAM
        inputs = {k: v.requires_grad_() for k, v in inputs.items()}

        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)

        top_prob, pred_index = torch.max(probs, dim=1)
        pred_idx = pred_index[0].item()
        confidence = top_prob[0].item() * 100
        label = id2label[str(pred_idx)]

        # ---------------- Grad-CAM ----------------
        heatmap = vit_gradcam(model, inputs)
        gradcam_img = generate_gradcam_image(img, heatmap)
        gradcam_base64 = image_to_base64(gradcam_img)

        # ---------------- Confidence filter ----------------
        if confidence < 50:
            label = "Unknown Waste"

        return jsonify({
            "prediction": label,
            "confidence": round(confidence, 2),
            "gradcam": gradcam_base64
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# -------------------- RUN --------------------
if __name__ == "__main__":
    app.run(debug=True)
