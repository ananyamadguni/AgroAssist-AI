import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

print("Starting agricultural model training...")

# -------------------------------------------------------------
# 1. CROP RECOMMENDATION MODEL (Classification)
# -------------------------------------------------------------
crops = ["Rice", "Wheat", "Maize", "Cotton", "Tomato", "Potato", "Sugarcane", "Coffee"]
n_samples = 1500

np.random.seed(42)
N = np.random.uniform(10, 140, n_samples)
P = np.random.uniform(10, 100, n_samples)
K = np.random.uniform(15, 120, n_samples)
temp = np.random.uniform(15, 38, n_samples)
humidity = np.random.uniform(30, 95, n_samples)
ph = np.random.uniform(4.5, 8.5, n_samples)
rainfall = np.random.uniform(40, 300, n_samples)

crop_targets = []
for i in range(n_samples):
    if rainfall[i] > 180 and temp[i] > 22:
        crop_targets.append("Rice")
    elif N[i] > 80 and ph[i] > 6.0 and rainfall[i] < 120:
        crop_targets.append("Wheat")
    elif P[i] > 60 and K[i] > 60:
        crop_targets.append("Potato")
    elif temp[i] > 28 and rainfall[i] > 120:
        crop_targets.append("Cotton")
    elif temp[i] < 26 and rainfall[i] > 150:
        crop_targets.append("Coffee")
    elif ph[i] > 6.8 and N[i] > 60:
        crop_targets.append("Tomato")
    elif rainfall[i] > 160:
        crop_targets.append("Sugarcane")
    else:
        crop_targets.append("Maize")

df_crop = pd.DataFrame({
    "N": N, "P": P, "K": K, "temperature": temp,
    "humidity": humidity, "ph": ph, "rainfall": rainfall,
    "label": crop_targets
})

crop_model = Pipeline([
    ("scaler", StandardScaler()),
    ("rf", RandomForestClassifier(n_estimators=100, random_state=42))
])
crop_model.fit(df_crop[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]], df_crop["label"])
joblib.dump(crop_model, "crop_recommendation_model.pkl")
print("Saved: crop_recommendation_model.pkl")

# -------------------------------------------------------------
# 2. FERTILIZER RECOMMENDATION MODEL (Classification)
# -------------------------------------------------------------
fertilizers = ["Urea", "DAP", "14-35-14", "28-28-0", "17-17-17", "20-20-0"]
soil_types = ["Sandy", "Loamy", "Black", "Red", "Clayey"]

soil_col = np.random.choice(soil_types, n_samples)
fert_N = np.random.uniform(10, 100, n_samples)
fert_P = np.random.uniform(10, 90, n_samples)
fert_K = np.random.uniform(10, 80, n_samples)
moisture = np.random.uniform(20, 80, n_samples)

fert_targets = []
for i in range(n_samples):
    if fert_N[i] < 30:
        fert_targets.append("Urea")
    elif fert_P[i] < 25:
        fert_targets.append("DAP")
    elif fert_K[i] < 25:
        fert_targets.append("17-17-17")
    elif moisture[i] < 35:
        fert_targets.append("14-35-14")
    elif fert_N[i] > 70:
        fert_targets.append("28-28-0")
    else:
        fert_targets.append("20-20-0")

df_fert = pd.DataFrame({
    "soil_type": soil_col, "N": fert_N, "P": fert_P, "K": fert_K,
    "moisture": moisture, "label": fert_targets
})

soil_encoder = LabelEncoder()
df_fert["soil_encoded"] = soil_encoder.fit_transform(df_fert["soil_type"])

fert_model = RandomForestClassifier(n_estimators=100, random_state=42)
fert_model.fit(df_fert[["soil_encoded", "N", "P", "K", "moisture"]], df_fert["label"])
joblib.dump(fert_model, "fertilizer_model.pkl")
joblib.dump(soil_encoder, "soil_encoder.pkl")
print("Saved: fertilizer_model.pkl & soil_encoder.pkl")

# -------------------------------------------------------------
# 3. HARVEST YIELD REGRESSOR (Continuous Regression)
# -------------------------------------------------------------
crop_names = ["Tomato", "Rice", "Wheat", "Corn", "Cotton", "Potato"]
yield_crop_encoder = LabelEncoder()
yield_crop_encoder.fit(crop_names)

sample_crops = np.random.choice(crop_names, n_samples)
sample_acres = np.random.uniform(0.5, 25.0, n_samples)
sample_rain = np.random.uniform(500, 2200, n_samples)
sample_fert_used = np.random.uniform(50, 400, n_samples)

base_rates = {"Tomato": 9.5, "Rice": 2.4, "Wheat": 2.1, "Corn": 3.8, "Cotton": 1.2, "Potato": 11.0}
yield_tonnes = []
for c, a, r, f in zip(sample_crops, sample_acres, sample_rain, sample_fert_used):
    rate = base_rates[c] * (1.0 + (f / 1000.0)) * (0.8 + (r / 5000.0))
    total_yield = rate * a + np.random.normal(0, 0.2)
    yield_tonnes.append(max(0.2, round(total_yield, 2)))

df_yield = pd.DataFrame({
    "crop": sample_crops,
    "crop_encoded": yield_crop_encoder.transform(sample_crops),
    "acres": sample_acres,
    "annual_rainfall": sample_rain,
    "fertilizer_kg": sample_fert_used,
    "yield_tonnes": yield_tonnes
})

yield_regressor = RandomForestRegressor(n_estimators=120, random_state=42)
yield_regressor.fit(df_yield[["crop_encoded", "acres", "annual_rainfall", "fertilizer_kg"]], df_yield["yield_tonnes"])
joblib.dump(yield_regressor, "yield_regressor_model.pkl")
joblib.dump(yield_crop_encoder, "yield_crop_encoder.pkl")
print("Saved: yield_regressor_model.pkl & yield_crop_encoder.pkl")

# -------------------------------------------------------------
# 4. WEED & PEST CLASSIFIER LABELS CONFIGURATION
# -------------------------------------------------------------
pest_weed_classes = {
    0: {"name": "Parthenium Hysterophorus (Congress Grass)", "type": "Invasive Weed", "remedy": "Manual uprooting before flowering or glyphosate spray."},
    1: {"name": "Cyperus Rotundus (Nut Grass)", "type": "Noxious Weed", "remedy": "Solarization or post-emergence herbicide like Halosulfuron-methyl."},
    2: {"name": "Spodoptera Frugiperda (Fall Armyworm)", "type": "Insect Pest", "remedy": "Emamectin benzoate 5% SG (0.4g/L) or neem seed kernel extract."},
    3: {"name": "Aphids (Aphidoidea)", "type": "Sucking Pest", "remedy": "Spray Imidacloprid 17.8 SL (0.3ml/L) or neem oil 3000 ppm."},
    4: {"name": "No Pest / Healthy Vegetation", "type": "Clean", "remedy": "No chemical intervention needed."}
}
joblib.dump(pest_weed_classes, "pest_weed_classes.pkl")
print("Saved: pest_weed_classes.pkl")
print("All 4 agricultural models trained and saved successfully!")