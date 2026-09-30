import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

train_data = datasets.ImageFolder('dataset/train', transform)
val_data = datasets.ImageFolder('dataset/val', transform)

hyperparameter_configs = [
    {"lr": 0.001, "weight_decay": 1e-4, "batch_size": 4},
    {"lr": 0.0005, "weight_decay": 1e-4, "batch_size": 4},
    {"lr": 0.0001, "weight_decay": 1e-5, "batch_size": 4},
    {"lr": 0.002, "weight_decay": 0.0, "batch_size": 4},
    {"lr": 0.0008, "weight_decay": 1e-3, "batch_size": 4},
]

best_acc = 0.0

for idx, cfg in enumerate(hyperparameter_configs):
    print(f"\n--- Strategy 1 | Iteration {idx + 1}/{len(hyperparameter_configs)}: {cfg} ---")
    train_loader = DataLoader(train_data, batch_size=cfg["batch_size"], shuffle=True)
    val_loader = DataLoader(val_data, batch_size=cfg["batch_size"], shuffle=False)

    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    for param in model.features.parameters():
        param.requires_grad = False
    model.classifier[1] = nn.Linear(model.last_channel, len(train_data.classes))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=cfg["lr"], weight_decay=cfg["weight_decay"])

    for epoch in range(2):
        model.train()
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            loss = criterion(model(inputs), labels)
            loss.backward()
            optimizer.step()

    model.eval()
    correct, total = 0, 0
    with torch.no_grad():
        for inputs, labels in val_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            correct += torch.sum(preds == labels.data).item()
            total += labels.size(0)

    acc = correct / total if total > 0 else 0
    print(f"Validation Accuracy: {acc:.4f}")

    if acc >= best_acc:
        best_acc = acc
        torch.save(model.state_dict(), "backend/crop_disease_model.pth")
        print("-> Checkpoint updated in backend/crop_disease_model.pth")