import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// CSV parsing function (inlined)
function parseCSV(csvText) {
  const rows = csvText.trim().split("\n").map(r => r.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/));
  const headers = rows[0].map(h => h.replace(/"/g,'').trim());
  const data = rows.slice(1).map(r => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = r[i] ? r[i].replace(/"/g,'').trim() : "";
    });
    return obj;
  });
  return data;
}

// Published Google Sheet CSV URL
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzVa6P71QLdzWt8ONzKTc1GDHQegaspjLktqQeHOCEL-OrKcQ8n3cSh_KtrJSq0nZuJN50v_iHzEBy/pub?output=csv";

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
        const found = users.find(u => String(u["Sr.No"]).trim() === String(id).trim());
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

  if (loading) return <h2 style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
  if (!user) return <h2 style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>User not found</h2>;

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      padding: "40px",
      backgroundColor: "#121212",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    }}>
      <div style={{
        display: "inline-block",
        backgroundColor: "#1e1e1e",
        padding: "30px 40px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        color: "#fff",
        animation: "fadeIn 0.8s ease-out",
        maxWidth: "350px",
        width: "100%",
      }}>
        <h1 style={{ marginBottom: "15px", fontSize: "2rem", color: "#00e0ff" }}>{user["NAME"]}</h1>
        <p style={{ margin: "8px 0" }}><b>College:</b> {user["COLLEGE"]}</p>
        <p style={{ margin: "8px 0" }}><b>Contact:</b> {user["CONTACT"]}</p>
        <p style={{ margin: "8px 0" }}><b>ID:</b> {user["Sr.No"]}</p>
         <p style={{ margin: "8px 0" }}><b>Lunch:</b> {user["Lunch"]}</p>

      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default User;
