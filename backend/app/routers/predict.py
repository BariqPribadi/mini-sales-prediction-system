import os
import numpy as np
import joblib
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.request import PredictRequest, PredictResponse
from app.auth import verify_token

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '..', '..', '..', 'ml', 'model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, '..', '..', '..', 'ml', 'scaler.pkl')

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
except FileNotFoundError:
    model = None
    scaler = None


@router.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest, _username: str = Depends(verify_token)):
    """
    Prediksi status produk berdasarkan jumlah_penjualan, harga, dan diskon.
    Membutuhkan JWT token yang valid.
    
    - Input: jumlah_penjualan, harga, diskon
    - Output: status (Laris / Tidak) + keterangan
    """
    if model is None or scaler is None:
        raise HTTPException(
            status_code=500,
            detail="Model belum tersedia. Jalankan train.py terlebih dahulu."
        )

    try:
        input_data = np.array([[
            payload.jumlah_penjualan,
            payload.harga,
            payload.diskon
        ]])

        input_scaled = scaler.transform(input_data)

        result = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0]

        status_label = "Laris" if result == 1 else "Tidak Laris"
        confidence = round(max(probability) * 100, 2)

        return PredictResponse(
            status=status_label,
            keterangan=f"Produk diprediksi {status_label} dengan tingkat persentase {confidence}%"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Terjadi kesalahan saat prediksi: {str(e)}"
        )