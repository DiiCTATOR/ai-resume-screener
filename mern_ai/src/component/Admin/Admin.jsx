import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { Skeleton } from '@mui/material';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';

const Admin = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoader(true);
        const res = await axios.get('/api/resume/get');
        if (res.data && res.data.resumes) {
          setData(res.data.resumes);
        }
      } catch (err) {
        console.error("Error fetching all resumes for admin:", err);
      } finally {
        setLoader(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className={styles.Admin}>
      <h1 style={{ margin: "20px 40px", fontSize: "28px" }}>Admin Resume Submissions</h1>
      <div className={styles.AdminBlock}>
        {loader && (
          <>
            <Skeleton variant="rectangular" width={266} height={300} sx={{ borderRadius: "20px" }} />
            <Skeleton variant="rectangular" width={266} height={300} sx={{ borderRadius: "20px" }} />
            <Skeleton variant="rectangular" width={266} height={300} sx={{ borderRadius: "20px" }} />
          </>
        )}

        {!loader && data.length === 0 && (
          <div style={{ padding: "40px", fontSize: "18px", color: "#666" }}>
            No candidate submissions recorded in the database yet.
          </div>
        )}

        {!loader && data.map((item) => (
          <div key={item._id} style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 6px 14px rgba(0, 0, 0, 0.08)",
            width: "280px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            boxSizing: "border-box"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", fontSize: "15px", color: "#111" }}>{item.user?.name || "Candidate"}</span>
              <span style={{
                background: "linear-gradient(90deg, #fca326, #f94a6b)",
                color: "white",
                padding: "3px 10px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "13px"
              }}>{item.score}%</span>
            </div>

            <div style={{ fontSize: "12px", color: "#666" }}>{item.user?.email || "No email"}</div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>Resume: {item.resume_name}</div>
            <div style={{ fontSize: "12px", color: "#555", maxHeight: "110px", overflowY: "auto", lineHeight: "1.5" }}>
              {item.feedback}
            </div>
            <div style={{ fontSize: "11px", color: "#999", marginTop: "auto" }}>
              Dated: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WithAuthHOC(Admin);
