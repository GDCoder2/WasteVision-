import requests
import base64

url = "http://127.0.0.1:5000/predict"

files = {"file": open("test2.jpg", "rb")}

response = requests.post(url, files=files)
data = response.json()

print("Prediction:", data["prediction"])
print("Confidence:", data["confidence"])

# Decode and save Grad-CAM image
img_data = base64.b64decode(data["gradcam"])

with open("gradcam_output.jpg", "wb") as f:
    f.write(img_data)

print("✅ Grad-CAM image saved as gradcam_output.jpg")