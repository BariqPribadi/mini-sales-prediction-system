import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(username, password);
            navigate("/dashboard");
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Username atau password salah.");
            } else {
                setError("Terjadi kesalahan. Coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Sales Prediction</h2>
                <p style={styles.subtitle}>Masuk untuk melanjutkan</p>

                <form onSubmit={handleLogin}>
                    <div style={styles.field}>
                        <label style={styles.label}>Username</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            required
                        />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? "Memproses..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
    },
    card: {
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
    },
    title: {
        margin: "0 0 4px",
        fontSize: "24px",
        color: "#1a1a1a",
    },
    subtitle: {
        margin: "0 0 24px",
        color: "#888",
        fontSize: "14px",
    },
    field: {
        marginBottom: "16px",
    },
    label: {
        display: "block",
        marginBottom: "6px",
        fontSize: "14px",
        color: "#333",
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "14px",
        boxSizing: "border-box",
        outline: "none",
    },
    error: {
        color: "#e53e3e",
        fontSize: "13px",
        marginBottom: "12px",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#4f46e5",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "15px",
        cursor: "pointer",
        marginTop: "8px",
    },
};
