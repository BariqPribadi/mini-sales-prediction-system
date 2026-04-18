export default function SalesTable({ data, loading }) {
    if (loading) return <p style={styles.info}>Memuat data...</p>;
    if (!data || data.length === 0) return <p style={styles.info}>Tidak ada data.</p>;

    return (
        <div style={styles.wrapper}>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.headerRow}>
                            <th style={styles.th}>Product ID</th>
                            <th style={styles.th}>Nama Produk</th>
                            <th style={styles.th}>Jumlah Penjualan</th>
                            <th style={styles.th}>Harga</th>
                            <th style={styles.th}>Diskon</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.product_id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                <td style={styles.td}>{item.product_id}</td>
                                <td style={styles.td}>{item.product_name}</td>
                                <td style={styles.td}>{item.jumlah_penjualan}</td>
                                <td style={styles.td}>Rp {item.harga.toLocaleString("id-ID")}</td>
                                <td style={styles.td}>{item.diskon}%</td>
                                <td style={styles.td}>
                                    <span style={item.status === "Laris" ? styles.badgeLaris : styles.badgeTidak}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        marginTop: "12px",
    },
    tableContainer: {
        overflowX: "auto",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
    },
    headerRow: {
        backgroundColor: "#4f46e5",
    },
    th: {
        padding: "12px 16px",
        textAlign: "left",
        color: "#fff",
        fontWeight: "600",
        whiteSpace: "nowrap",
    },
    rowEven: {
        backgroundColor: "#fff",
    },
    rowOdd: {
        backgroundColor: "#f9fafb",
    },
    td: {
        padding: "10px 16px",
        borderBottom: "1px solid #e5e7eb",
        color: "#374151",
    },
    badgeLaris: {
        backgroundColor: "#d1fae5",
        color: "#065f46",
        padding: "2px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "600",
    },
    badgeTidak: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        padding: "2px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "600",
    },
    info: {
        color: "#888",
        fontSize: "14px",
        padding: "16px 0",
    },
};
