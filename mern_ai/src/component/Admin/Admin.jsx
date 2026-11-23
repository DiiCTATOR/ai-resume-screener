/* eslint-disable react-refresh/only-export-components */
import styles from './Admin.module.css';
import { Skeleton } from '@mui/material';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const Admin = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoader(true);
      try {
        const res = await axios.get('/api/resume/get');
        setData(res.data.resumes || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className={styles.Admin}>
      <div className={styles.AdminBlock}>
        {
          loader && <>
            <Skeleton variant="rectangular" width={266} height={400} sx={{ borderRadius: "20px" }} />
            <Skeleton variant="rectangular" width={266} height={400} sx={{ borderRadius: "20px" }} />
            <Skeleton variant="rectangular" width={266} height={400} sx={{ borderRadius: "20px" }} />
          </>
        }

        {
          data.map((item) => (
            <div key={item._id} className={styles.AdminCard}>
              <h2>{item.user?.name || "Candidate"}</h2>
              <p style={{ color: "#666", fontSize: "14px" }}>{item.user?.email}</p>
              <h3 style={{ color: "#f94a6b", margin: "10px 0" }}>Score: {item.score}%</h3>
              <p><strong>Resume:</strong> {item.resume_name}</p>
              <p style={{ fontSize: "14px", lineHeight: "1.5" }}>{item.feedback}</p>
              <p style={{ fontSize: "12px", color: "#888", marginTop: "10px" }}>
                Dated: {item.createdAt ? item.createdAt.slice(0, 10) : ""}
              </p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default WithAuthHOC(Admin);
