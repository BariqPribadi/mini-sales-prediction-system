from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
    username: str
    password: str

class PredictRequest(BaseModel):
    jumlah_penjualan: float = Field(..., ge=0, description="Jumlah unit terjual")
    harga: float = Field(..., gt=0, description="Harga satuan per item")
    diskon: float = Field(..., ge=0, le=100, description="Diskon dalam persen (0-100)")

class PredictResponse(BaseModel):
    status: str
    keterangan: str