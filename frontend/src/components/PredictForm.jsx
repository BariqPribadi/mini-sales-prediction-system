import { useState } from "react";
import { predict } from "../services/api";

export default function PredictForm() {
    const [form, setForm] = useState({
        jumlah_penjualan: "",
        harga: "",
        diskon: "",
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);
        setLoading(true);

        try {
            const data = await predict(Number(form.jumlah_penjualan), Number(form.harga), Number(form.diskon));
            setResult(data);
        } catch (err) {
            if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Terjadi kesalahan saat prediksi.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.card}>
            <h3 style={styles.title}>Form Prediksi Produk</h3>
            <p style={styles.subtitle}>Masukkan data produk untuk memprediksi status penjualan</p>

            <form onSubmit={handleSubmit}>
                <div style={styles.row}>
                    <div style={styles.field}>
                        <label style={styles.label}>Jumlah Penjualan</label>
                        <input
                            style={styles.input}
                            type="number"
                            name="jumlah_penjualan"
                            value={form.jumlah_penjualan}
                            onChange={handleChange}
                            placeholder="cth: 250"
                            min="0"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Harga Satuan (Rp)</label>
                        <input
                            style={styles.input}
                            type="number"
                            name="harga"
                            value={form.harga}
                            onChange={handleChange}
                            placeholder="cth: 50000"
                            min="1"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Diskon (%)</label>
                        <input
                            style={styles.input}
                            type="number"
                            name="diskon"
                            value={form.diskon}
                            onChange={handleChange}
                            placeholder="cth: 10"
                            min="0"
                            max="100"
                            required
                        />
                    </div>
                </div>

                <button style={styles.button} type="submit" disabled={loading}>
                    {loading ? "Memproses..." : "Prediksi Sekarang"}
                </button>
            </form>

            {error && <p style={styles.error}>{error}</p>}

            {result && (
                <div style={result.status === "Laris" ? styles.resultLaris : styles.resultTidak}>
                    <p style={styles.resultStatus}>
                        {result.status === "Laris" ? "✅" : "❌"} {result.status}
                    </p>
                    <p style={styles.resultKeterangan}>{result.keterangan}</p>
                </div>
            )}
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        marginBottom: "24px",
    },
    title: {
        margin: "0 0 4px",
        fontSize: "16px",
        color: "#1a1a1a",
    },
    subtitle: {
        margin: "0 0 20px",
        fontSize: "13px",
        color: "#888",
    },
    row: {
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
    },
    field: {
        flex: "1",
        minWidth: "150px",
    },
    label: {
        display: "block",
        marginBottom: "6px",
        fontSize: "13px",
        color: "#374151",
        fontWeight: "500",
    },
    input: {
        width: "100%",
        padding: "9px 12px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "14px",
        boxSizing: "border-box",
    },
    button: {
        marginTop: "16px",
        padding: "10px 24px",
        backgroundColor: "#4f46e5",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        cursor: "pointer",
    },
    error: {
        marginTop: "12px",
        color: "#e53e3e",
        fontSize: "13px",
    },
    resultLaris: {
        marginTop: "16px",
        padding: "16px",
        backgroundColor: "#d1fae5",
        borderRadius: "8px",
        border: "1px solid #6ee7b7",
    },
    resultTidak: {
        marginTop: "16px",
        padding: "16px",
        backgroundColor: "#fee2e2",
        borderRadius: "8px",
        border: "1px solid #fca5a5",
    },
    resultStatus: {
        margin: "0 0 4px",
        fontWeight: "700",
        fontSize: "18px",
        color: "#1a1a1a",
    },
    resultKeterangan: {
        margin: "0",
        fontSize: "13px",
        color: "#374151",
    },
};
