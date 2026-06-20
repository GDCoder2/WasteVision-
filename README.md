# WasteVision AI

WasteVision AI is an image-based waste classification project. It uses a local Vision Transformer model to classify uploaded waste images into 36 categories and returns a Grad-CAM heatmap to show the image regions that influenced the prediction.

The project includes:

- Flask API for model inference
- Local Hugging Face `ViTForImageClassification` model files
- Grad-CAM style visual explanation output
- Static HTML/CSS/JavaScript frontend
- Simple API test script

## Project Structure

```text
Waste_api/
+-- app.py                    # Flask API and model inference
+-- requirements.txt          # Python dependencies
+-- test_api.py               # Example API request script
+-- Frontend/
|   +-- index.html            # Web UI
|   +-- script.js             # Frontend logic and API call
|   +-- styles.css            # Frontend styling
+-- Waste_ViT_model/
    +-- config.json
    +-- labels.json
    +-- model.safetensors
    +-- preprocessor_config.json
```

## Features

- Classifies waste images into 36 waste categories
- Returns prediction confidence
- Generates a Grad-CAM heatmap image
- Marks low-confidence predictions as `Unknown Waste`
- Provides a frontend with upload, preview, classification result, disposal tips, impact information, and waste guide pages

## Waste Classes

The model supports these categories:

```text
A_Foods
B_Animal Dead Body
C_Cardboard
D_Newspaper
E_Paper Cups
F_Papers
G_Brown Glass
H_Porcelin
I_Green Glass
J_White Glass
K_Beverage Cans
L_Construction Scrap
M_Metal Containers
N_Plastic Bag
O_Plastic Bottle
Q_Plastic Containers
R_Plastic Cups
S_Tetra Pak
T_Clothes
U_Shoes
V_Gloves
W_Masks
X_Bandai
Y_Medicine and Medicine Strip
Z_A_A_Syringe
Z_A_Diaper
Z_B_Electrical Cables
Z_C_Electronic Chips
Z_D_Laptops
Z_E_Small Appliances
Z_F_Smartphones
Z_G_Battery
Z_H_Thermometer
Z_I_Cigarette Butt
Z_J_Pesticidebottle
Z_K_Spray cans
```

## Requirements

- Python 3.10 or newer recommended
- Local model files inside `Waste_ViT_model/`
- A browser for the frontend

Python packages are listed in `requirements.txt`.

## Installation

Create and activate a virtual environment:

```bash
python -m venv .venv
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

On macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Run the API

Start the Flask server from the project root:

```bash
python app.py
```

By default, the API runs at:

```text
http://127.0.0.1:5000
```

Open this URL to check the API status:

```text
http://127.0.0.1:5000/
```

Expected response:

```text
Waste Classification API with Grad-CAM is running
```

## Run the Frontend

Open this file in a browser:

```text
Frontend/index.html
```

The frontend sends image classification requests to:

```text
http://localhost:5000/predict
```

Make sure the Flask API is running before using the classify page.

## API Usage

### `POST /predict`

Uploads an image and returns a waste prediction.

Request type:

```text
multipart/form-data
```

Form field:

```text
file
```

Example using `curl`:

```bash
curl -X POST http://127.0.0.1:5000/predict -F "file=@test2.jpg"
```

Example JSON response:

```json
{
  "prediction": "O_Plastic Bottle",
  "confidence": 94.7,
  "gradcam": "/9j/4AAQSkZJRgABAQ..."
}
```

The `gradcam` field is a base64-encoded JPEG image.

## Test Script

Run the included test script after starting the API:

```bash
python test_api.py
```

The script uploads `test2.jpg`, prints the prediction and confidence, then saves the returned Grad-CAM image as:

```text
gradcam_output.jpg
```

## Model Notes

The backend loads the model from:

```text
Waste_ViT_model/
```

Required files include:

- `config.json`
- `labels.json`
- `model.safetensors`
- `preprocessor_config.json`

Do not move or rename this folder unless you also update the paths in `app.py`.

## Deployment Notes

`gunicorn` is included in `requirements.txt` for production-style deployment. On Linux servers, the app can be started with:

```bash
gunicorn app:app
```

For local development on Windows, use:

```bash
python app.py
```

## Team

- Gurdarshan
- Yash Singh
- Shivam
