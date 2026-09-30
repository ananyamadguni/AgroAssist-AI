import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

# ---------------------------------------------------------
# 1. TRAIN CROP RECOMMENDER (NPK + Climate -> Crop Class)
# ---------------------------------------------------------
print("Training Crop Recommendation Model...")
crops = [
    'Rice', 'Maize', 'Chickpea', 'Kidneybeans', 'Pigeonpeas', 
    'Mothbeans', 'Mungbean', 'Blackgram', 'Lentil', 'Pomegranate', 
    'Banana', 'Mango', 'Grapes', 'Watermelon', 'Apple', 
    'Orange', 'Papaya', 'Coconut', 'Cotton', 'Jute', 'Coffee'
]

crop_rows = []
for crop in crops:
    for _ in range(60):
        crop_rows.append({
            'N': np.random.uniform(20, 140),
            'P': np.random.uniform(10, 80),
            'K': np.random.uniform(15, 120),
            'temperature': np.random.uniform(15, 38),
            'humidity': np.random.uniform(40, 95),
            'ph': np.random.uniform(5.0, 8.5),
            'rainfall': np.random.uniform(40, 300),
            'label': crop
        })

df_crop = pd.DataFrame(crop_rows)
X_crop = df_crop[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y_crop = df_crop['label']

crop_model = RandomForestClassifier(n_estimators=100, random_state=42)
crop_model.fit(X_crop, y_crop)
joblib.dump(crop_model, 'crop_recommender.pkl')
print(" Saved 'crop_recommender.pkl'")

# ---------------------------------------------------------
# 2. TRAIN FERTILIZER ADVISOR (Soil + Nutrients -> Fertilizer)
# ---------------------------------------------------------
print("\nTraining Fertilizer Advisor Model...")
fertilizers = ['Urea', 'DAP', '14-35-14', '28-28-0', '17-17-17', '20-20-0', '10-26-26']
soil_types = ['Loamy', 'Sandy', 'Clayey', 'Black', 'Red']

fert_rows = []
for _ in range(350):
    fert_rows.append({
        'soil_type': np.random.choice(soil_types),
        'moisture': np.random.uniform(20, 70),
        'N': np.random.uniform(10, 50),
        'P': np.random.uniform(10, 50),
        'K': np.random.uniform(10, 50),
        'fertilizer': np.random.choice(fertilizers)
    })

df_fert = pd.DataFrame(fert_rows)
le_soil = LabelEncoder()
df_fert['soil_encoded'] = le_soil.fit_transform(df_fert['soil_type'])
X_fert = df_fert[['soil_encoded', 'moisture', 'N', 'P', 'K']]
y_fert = df_fert['fertilizer']

fert_model = RandomForestClassifier(n_estimators=100, random_state=42)
fert_model.fit(X_fert, y_fert)
joblib.dump(fert_model, 'fertilizer_model.pkl')
joblib.dump(le_soil, 'soil_encoder.pkl')
print(" Saved 'fertilizer_model.pkl' & 'soil_encoder.pkl'")

# ---------------------------------------------------------
# 3. TRAIN YIELD PREDICTOR (Crop + Acres -> Harvest Tonnage)
# ---------------------------------------------------------
print("\nTraining Harvest Yield Regressor...")
yield_factors = {'Tomato': 8.5, 'Rice': 3.2, 'Wheat': 2.8, 'Corn': 4.1}

yield_rows = []
for crop_name, rate in yield_factors.items():
    for _ in range(60):
        acres = np.random.uniform(0.5, 25.0)
        tonnes = (acres * rate) + np.random.normal(0, 0.3)
        yield_rows.append({'crop': crop_name, 'acres': acres, 'total_tonnes': max(0.1, tonnes)})

df_yield = pd.DataFrame(yield_rows)
le_crop = LabelEncoder()
df_yield['crop_encoded'] = le_crop.fit_transform(df_yield['crop'])
X_yield = df_yield[['crop_encoded', 'acres']]
y_yield = df_yield['total_tonnes']

yield_regressor = RandomForestRegressor(n_estimators=100, random_state=42)
yield_regressor.fit(X_yield, y_yield)
joblib.dump(yield_regressor, 'yield_regressor.pkl')
joblib.dump(le_crop, 'crop_encoder.pkl')
print(" Saved 'yield_regressor.pkl' & 'crop_encoder.pkl'")

print("\nModel pipeline training complete!")