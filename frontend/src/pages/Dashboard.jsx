import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSales, logout } from "../services/api";
import SalesTable from "../components/SalesTable";
import PredictForm from "../components/PredictForm";

const PAGE_SIZE = 10;

export default function Dashboard() {
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const data = await getSales();
                setSales(data.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate("/");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/");
        }
    };

    const larisCount = sales.filter((s) => s.status === "Laris").length;
    const tidakLarisCount = sales.filter((s) => s.status === "Tidak").length;

    const totalPages = Math.ceil(sales.length / PAGE_SIZE);
    const paginatedData = sales.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Dashboard Penjualan</h1>
                    <p style={styles.subtitle}>Mini AI Sales Prediction System</p>
                </div>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div style={styles.statsRow}>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Total Produk</p>
                    <p style={styles.statValue}>{sales.length.toLocaleString("id-ID")}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Produk Laris</p>
                    <p style={{ ...styles.statValue, color: "#065f46" }}>{larisCount.toLocaleString("id-ID")}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Produk Tidak Laris</p>
                    <p style={{ ...styles.statValue, color: "#991b1b" }}>{tidakLarisCount.toLocaleString("id-ID")}</p>
                </div>
            </div>

            <PredictForm />

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Data Penjualan</h2>
                <SalesTable data={paginatedData} loading={loading} />

                {!loading && totalPages > 1 && (
                    <div style={styles.pagination}>
                        <button style={styles.pageBtn} onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                            «
                        </button>
                        <button
                            style={styles.pageBtn}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            disabled={currentPage === 1}>
                            ‹
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => Math.abs(p - currentPage) <= 1)
                            .map((p) => (
                                <button
                                    key={p}
                                    style={p === currentPage ? styles.pageBtnActive : styles.pageBtn}
                                    onClick={() => setCurrentPage(p)}>
                                    {p}
                                </button>
                            ))}

                        <button
                            style={styles.pageBtn}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            disabled={currentPage === totalPages}>
                            ›
                        </button>
                        <button
                            style={styles.pageBtn}
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}>
                            »
                        </button>

                        <span style={styles.pageInfo}>
                            Halaman {currentPage} dari {totalPages} ({sales.length.toLocaleString("id-ID")} data)
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
    title: { margin: "0 0 4px", fontSize: "22px", color: "#1a1a1a" },
    subtitle: { margin: "0", fontSize: "13px", color: "#888" },
    logoutBtn: {
        padding: "8px 18px",
        backgroundColor: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        cursor: "pointer",
    },
    statsRow: { display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" },
    statCard: {
        flex: "1",
        minWidth: "150px",
        backgroundColor: "#fff",
        padding: "16px 20px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
    },
    statLabel: { margin: "0 0 4px", fontSize: "13px", color: "#888" },
    statValue: { margin: "0", fontSize: "24px", fontWeight: "700", color: "#1a1a1a" },
    section: { backgroundColor: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb" },
    sectionTitle: { margin: "0 0 12px", fontSize: "16px", color: "#1a1a1a" },
    pagination: { display: "flex", alignItems: "center", gap: "4px", marginTop: "16px", flexWrap: "wrap" },
    pageBtn: {
        padding: "6px 10px",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        backgroundColor: "#fff",
        color: "#374151",
        cursor: "pointer",
        fontSize: "13px",
    },
    pageBtnActive: {
        padding: "6px 10px",
        border: "1px solid #4f46e5",
        borderRadius: "6px",
        backgroundColor: "#4f46e5",
        color: "#fff",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
    },
    pageInfo: { marginLeft: "8px", fontSize: "13px", color: "#888" },
};
