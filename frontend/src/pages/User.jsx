import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// CSV parsing function (inlined)
function parseCSV(csvText) {
  const rows = csvText
    .trim()
    .split("\n")
    .map((r) => r.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/));
  const headers = rows[0].map((h) => h.replace(/"/g, "").trim());
  const data = rows.slice(1).map((r) => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = r[i] ? r[i].replace(/"/g, "").trim() : "";
    });
    return obj;
  });
  return data;
}

// Published Google Sheet CSV URL
const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzVa6P71QLdzWt8ONzKTc1GDHQegaspjLktqQeHOCEL-OrKcQ8n3cSh_KtrJSq0nZuJN50v_iHzEBy/pub?output=csv";

const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const res = await fetch(GOOGLE_SHEET_CSV_URL);
        const csvText = await res.text();
        const users = parseCSV(csvText);
        const found = users.find(
          (u) => String(u["Sr.No"]).trim() === String(id).trim()
        );
        setUser(found || null);
      } catch (err) {
        console.error("Error fetching sheet:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSheet();
  }, [id]);

  // --- LOADING STATE ---
  if (loading)
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <h2 style={styles.loadingText}>Loading user data...</h2>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );

  // --- USER NOT FOUND STATE ---
  if (!user)
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h2 style={{ color: "#ff6b6b", marginBottom: "10px" }}>User Not Found</h2>
          <p style={{ color: "#bbb" }}>Please check the ID and try again.</p>
        </div>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </div>
    );

  // --- USER FOUND STATE ---
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.name}>{user["NAME"]}</h1>
        <p style={styles.info}>
          <b>College:</b> {user["COLLEGE"]}
        </p>
        <p style={styles.info}>
          <b>Contact:</b> {user["CONTACT"]}
        </p>
        <p style={styles.info}>
          <b>ID:</b> {user["Sr.No"]}
        </p>
        <p style={styles.info}>
          <b>Breakfast:</b> {user["Breakfast"]}
        </p>
        <p style={styles.info}>
          <b>Lunch:</b> {user["Lunch"]}
        </p>
        <p style={styles.info}>
          <b>Dinner:</b> {user["Dinner"]}
        </p>
      </div>

      <style>
{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 400px) {
    h1 { font-size: 1.5rem !important; }
    p { font-size: 0.9rem !important; }
  }
`}
</style>

    </div>
  );
};

// --- STYLES ---
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#121212",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
    padding: "20px", // prevents edge clipping on small screens
    boxSizing: "border-box",
  },

  card: {
    backgroundColor: "#1e1e1e",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
    color: "#fff",
    animation: "fadeIn 0.8s ease-out",
    width: "100%",
    maxWidth: "350px",
    boxSizing: "border-box",
  },

  name: {
    marginBottom: "15px",
    fontSize: "1.8rem",
    color: "#00e0ff",
    wordBreak: "break-word", // ensures long names wrap instead of overflowing
  },

  info: {
    margin: "8px 0",
    wordWrap: "break-word",
  },

  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid rgba(255,255,255,0.2)",
    borderTopColor: "#00e0ff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },

  loadingText: {
    color: "#00e0ff",
    fontSize: "1.2rem",
    letterSpacing: "1px",
  },

  errorCard: {
    backgroundColor: "#1e1e1e",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(255,0,0,0.4)",
    animation: "fadeIn 0.8s ease-out",
    width: "100%",
    maxWidth: "350px",
    boxSizing: "border-box",
  },
};


export default User;
