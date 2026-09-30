import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor
from sklearn.linear_model import Ridge, HuberRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

np.random.seed(42)
n_samples = 1200

rainfall = np.random.uniform(300, 1200, n_samples)
temp = np.random.uniform(18, 38, n_samples)
n_ratio = np.random.uniform(20, 140, n_samples)
p_ratio = np.random.uniform(10, 80, n_samples)
k_ratio = np.random.uniform(15, 90, n_samples)
area = np.random.uniform(0.5, 10, n_samples)

yield_tonnes = (
    0.003 * rainfall + 
    0.15 * temp + 
    0.04 * n_ratio + 
    0.03 * p_ratio + 
    0.02 * k_ratio + 
    (area * 3.2) + 
    np.random.normal(0, 1.2, n_samples)
)

X = np.column_stack([rainfall, temp, n_ratio, p_ratio, k_ratio, area])
y = yield_tonnes

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

models_pool = []

for n in [20, 50, 80]:
    for depth in [3, 5, 8, 12, None]:
        models_pool.append((f"RandomForest(n={n}, depth={depth})", RandomForestRegressor(n_estimators=n, max_depth=depth, random_state=42)))

for lr in [0.01, 0.05, 0.1]:
    for n in [30, 60, 100]:
        for depth in [2, 3]:
            models_pool.append((f"GradientBoosting(lr={lr}, n={n}, depth={depth})", GradientBoostingRegressor(learning_rate=lr, n_estimators=n, max_depth=depth, random_state=42)))

for n in [30, 70]:
    for depth in [4, 6, 10, 15, None]:
        models_pool.append((f"ExtraTrees(n={n}, depth={depth})", ExtraTreesRegressor(n_estimators=n, max_depth=depth, random_state=42)))

for alpha in [0.01, 0.1, 1.0, 10.0, 50.0]:
    models_pool.append((f"Ridge(alpha={alpha})", Ridge(alpha=alpha)))
    models_pool.append((f"Huber(alpha={alpha})", HuberRegressor(alpha=alpha, max_iter=500)))

models_pool = models_pool[:50]

print(f"Benchmarking across {len(models_pool)} tabular regression models...\n")

best_score = -float("inf")
best_model_name = ""
best_model_obj = None

for idx, (name, regressor) in enumerate(models_pool):
    regressor.fit(X_train, y_train)
    preds = regressor.predict(X_test)
    r2 = r2_score(y_test, preds)
    mse = mean_squared_error(y_test, preds)

    print(f"Model {idx+1:02d}/50 | {name:<42} | R2: {r2:.4f} | MSE: {mse:.4f}")

    if r2 > best_score:
        best_score = r2
        best_model_name = name
        best_model_obj = regressor

print(f"\n==========================================")
print(f"Champion: {best_model_name} with R2: {best_score:.4f}")
joblib.dump(best_model_obj, "backend/yield_model.pkl")
print("Saved champion model to 'backend/yield_model.pkl'")
print(f"==========================================")