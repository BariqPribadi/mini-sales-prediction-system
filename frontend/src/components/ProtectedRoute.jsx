import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/api";

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        getMe()
            .then(() => setChecking(false))
            .catch((err) => {
                if (err.response?.status === 401) {
                    navigate("/", { replace: true });
                } else {
                    setChecking(false);
                }
            });
    }, [navigate]);

    if (checking) {
        return (
            <div style={styles.container}>
                <p style={styles.text}>Memuat...</p>
            </div>
        );
    }

    return children;
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    text: { color: "#888", fontSize: "14px" },
};
