import styles from './History.module.css';
import { Skeleton } from '@mui/material';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState, useEffect, useContext } from 'react';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const History = () => {
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);

    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userInfo?._id) return;
            try {
                setLoader(true);
                const res = await axios.get(`/api/resume/get/${userInfo._id}`);
                if (res.data && res.data.resumes) {
                    setData(res.data.resumes);
                }
            } catch (err) {
                console.error("Error fetching user history:", err);
            } finally {
                setLoader(false);
            }
        };

        fetchUserData();
    }, [userInfo]);

    return (
        <div className={styles.History}>
            <div className={styles.HistoryCardBlock}>
                {
                    loader && (
                        <>
                            <Skeleton variant="rectangular" width={266} height={200} sx={{ borderRadius: "20px" }} />
                            <Skeleton variant="rectangular" width={266} height={200} sx={{ borderRadius: "20px" }} />
                            <Skeleton variant="rectangular" width={266} height={200} sx={{ borderRadius: "20px" }} />
                            <Skeleton variant="rectangular" width={266} height={200} sx={{ borderRadius: "20px" }} />
                        </>
                    )
                }

                {
                    !loader && data.length === 0 && (
                        <div style={{ padding: "40px", fontSize: "18px", color: "#666" }}>
                            No resume analysis history found yet. Upload and analyze a resume on the Dashboard!
                        </div>
                    )
                }

                {
                    !loader && data.map((item) => {
                        return (
                            <div key={item._id} className={styles.HistoryCard}>
                                <div className={styles.cardPercentage}>{item.score}%</div>
                                <h3 style={{ margin: "10px 0 5px", fontSize: "16px" }}>{item.resume_name}</h3>
                                <p style={{ color: "#444", fontSize: "13px", maxHeight: "110px", overflowY: "auto" }}>
                                    {item.feedback}
                                </p>
                                <p style={{ fontSize: "12px", color: "#888", marginTop: "auto" }}>
                                    Dated: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                                </p>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default WithAuthHOC(History);
