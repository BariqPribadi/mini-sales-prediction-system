from fastapi import APIRouter, HTTPException, status, Response, Depends
from app.schemas.request import LoginRequest
from app.auth import authenticate_user, create_access_token, verify_token

router = APIRouter()

@router.post("/login")
def login(payload: LoginRequest, response: Response):
    is_valid = authenticate_user(payload.username, payload.password)

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username atau password salah"
        )

    token = create_access_token(data={"sub": payload.username})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=3600
    )

    return {"message": "Login berhasil"}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logout berhasil"}

@router.get("/me")
def me(username: str = Depends(verify_token)):
    return {"username": username}