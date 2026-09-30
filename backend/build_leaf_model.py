import json
import torch
import torch.nn as nn
from torchvision import models

DISEASE_CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___healthy",
    "Corn___Common_rust",
    "Corn___healthy",
    "Grape___Black_rot",
    "Grape___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___healthy"
]

DISEASE_METADATA = {
    "Tomato___Early_blight": {
        "crop": "Tomato",
        "disease": "Early Blight",
        "symptoms": "Concentric dark rings and yellowing margins on lower leaves.",
        "prevention": "Ensure good spacing for aeration; water at ground level to keep foliage dry.",
        "treatment": "Apply a copper-based biological fungicide or neem oil spray every 7 days."
    },
    "Tomato___Late_blight": {
        "crop": "Tomato",
        "disease": "Late Blight",
        "symptoms": "Large, dark, water-soaked brown lesions on leaves and stems with white fungal mold underneath.",
        "prevention": "Avoid overhead irrigation; eliminate volunteer potato and tomato plants.",
        "treatment": "Prune and destroy infected leaves immediately; apply bio-fungicide protective sprays."
    },
    "Tomato___Bacterial_spot": {
        "crop": "Tomato",
        "disease": "Bacterial Spot",
        "symptoms": "Small, dark, greasy spots with yellow halos across leaves and stems.",
        "prevention": "Use certified disease-free seeds and maintain crop rotation cycles.",
        "treatment": "Apply fixed-copper bactericides mixed with mancozeb to reduce spread."
    },
    "Tomato___healthy": {
        "crop": "Tomato",
        "disease": "Healthy",
        "symptoms": "Vibrant green foliage with no discoloration or lesions.",
        "prevention": "Maintain regular watering and balanced nitrogen-phosphorus fertilization.",
        "treatment": "No treatment required. The crop is healthy."
    },
    "Potato___Early_blight": {
        "crop": "Potato",
        "disease": "Early Blight",
        "symptoms": "Target-like circular brown lesions on older leaves.",
        "prevention": "Rotate crops with non-solanaceous plants every 3 years.",
        "treatment": "Spray chlorothalonil or copper sulfate preventative mixtures."
    },
    "Potato___Late_blight": {
        "crop": "Potato",
        "disease": "Late Blight",
        "symptoms": "Purplish-brown lesions surrounded by pale green borders.",
        "prevention": "Plant certified resistant seed tubers; avoid damp, waterlogged fields.",
        "treatment": "Prune blighted foliage and apply systemic fungicides promptly."
    },
    "Potato___healthy": {
        "crop": "Potato",
        "disease": "Healthy",
        "symptoms": "Sturdy foliage with uniform green pigmentation.",
        "prevention": "Keep soil well-drained and maintain proper tuber hilling.",
        "treatment": "No treatment required."
    }
}

def create_model():
    print("Loading pretrained MobileNetV2 architecture...")
    weights = models.MobileNet_V2_Weights.DEFAULT
    model = models.mobilenet_v2(weights=weights)

    # Freeze earlier layers for fast inference
    for param in model.features.parameters():
        param.requires_grad = False

    # Adjust classifier head for agricultural classes
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(in_features, len(DISEASE_CLASSES))
    )

    model.eval()

    # Save artifacts
    checkpoint_path = "leaf_disease_mobilenet.pth"
    torch.save(model.state_dict(), checkpoint_path)
    print(f"Saved PyTorch weights to '{checkpoint_path}'")

    with open("disease_classes.json", "w") as f:
        json.dump(DISEASE_CLASSES, f, indent=2)

    with open("disease_metadata.json", "w") as f:
        json.dump(DISEASE_METADATA, f, indent=2)

    print("Saved 'disease_classes.json' and 'disease_metadata.json'")

if __name__ == "__main__":
    create_model()
