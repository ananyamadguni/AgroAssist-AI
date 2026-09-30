import os
from PIL import Image

classes = [
    'Tomato___Early_blight', 
    'Tomato___healthy', 
    'Potato___Early_blight', 
    'Potato___healthy', 
    'Corn___Common_rust', 
    'Corn___healthy'
]

splits = ['train', 'val']

for split in splits:
    for i, cls in enumerate(classes):
        target_dir = os.path.join('dataset', split, cls)
        os.makedirs(target_dir, exist_ok=True)
        for k in range(5):
            # Generate distinguishable color shades per class
            color = (25 * (i + 1), min(255, 60 + 25 * i), 45)
            img = Image.new('RGB', (224, 224), color=color)
            img.save(os.path.join(target_dir, f'sample_{k}.jpg'))

print(f"Generated samples across {len(classes)} classes for {splits} successfully.")
