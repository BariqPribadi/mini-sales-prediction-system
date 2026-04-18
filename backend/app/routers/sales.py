import os
import pandas as pd
from fastapi import APIRouter, HTTPException, Depends
from app.auth import verify_token

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', '..', '..', 'data', 'sales_data.csv')

try:
    _df = pd.read_csv(DATA_PATH)
    _df = _df.where(pd.notnull(_df), None)
    _sales_data = _df.to_dict(orient="records")
except FileNotFoundError:
    _sales_data = None


@router.get("/sales")
def get_sales(_username: str = Depends(verify_token)):
    if _sales_data is None:
        raise HTTPException(
            status_code=500,
            detail="File data penjualan tidak ditemukan"
        )
    return {
        "total": len(_sales_data),
        "data": _sales_data
    }