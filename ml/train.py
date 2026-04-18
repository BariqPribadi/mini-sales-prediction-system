import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'sales_data.csv')

df = pd.read_csv(DATA_PATH)

print("=== INFO DATASET ===")
print(f"Jumlah baris  : {len(df)}")
print(f"Jumlah kolom  : {len(df.columns)}")
print(f"Kolom         : {list(df.columns)}")
print(f"Missing values:\n{df.isnull().sum()}")
print(f"\nDistribusi status:\n{df['status'].value_counts()}")
print()

df['status_encoded'] = df['status'].map({'Laris': 1, 'Tidak': 0})

X = df[['jumlah_penjualan', 'harga', 'diskon']]
y = df['status_encoded']

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print("Rata-rata  :", scaler.mean_)
print("Std Deviasi:", scaler.scale_)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

print(f"Data training : {len(X_train)} baris")
print(f"Data testing  : {len(X_test)} baris")
print()

model = LogisticRegression(random_state=42)
model.fit(X_train, y_train)

print("Model selesai ditraining.")
print()

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, target_names=['Tidak Laris', 'Laris'])

print("=== HASIL EVALUASI ===")
print(f"Accuracy: {accuracy:.4f} ({accuracy * 100:.2f}%)")
print()
print("Classification Report:")
print(report)

print("Bobot Fitur:")
for fitur, bobot in zip(['jumlah_penjualan', 'harga', 'diskon'], model.coef_[0]):
    print(f"  {fitur:20s}: {bobot:.4f}")
print()

EVAL_PATH = os.path.join(BASE_DIR, 'evaluation.txt')
with open(EVAL_PATH, 'w') as f:
    f.write("=== HASIL EVALUASI MODEL ===\n\n")
    f.write(f"Accuracy: {accuracy:.4f} ({accuracy * 100:.2f}%)\n\n")
    f.write("Classification Report:\n")
    f.write(report)

print(f"Hasil evaluasi disimpan di: {EVAL_PATH}")
print()

MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.pkl')

joblib.dump(model, MODEL_PATH)
joblib.dump(scaler, SCALER_PATH)

print(f"Model disimpan di  : {MODEL_PATH}")
print(f"Scaler disimpan di : {SCALER_PATH}")
print()
print("Selesai!")