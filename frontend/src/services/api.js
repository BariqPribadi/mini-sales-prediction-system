import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const login = async (username, password) => {
    const response = await api.post("/login", { username, password });
    return response.data;
};

export const getSales = async () => {
    const response = await api.get("/sales");
    return response.data;
};

export const predict = async (jumlah_penjualan, harga, diskon) => {
    const response = await api.post("/predict", { jumlah_penjualan, harga, diskon });
    return response.data;
};

export const logout = async () => {
    await api.post("/logout");
};

export const getMe = async () => {
    const response = await api.get("/me");
    return response.data;
};
