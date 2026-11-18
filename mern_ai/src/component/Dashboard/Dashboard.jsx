import styles from './Dashboard.module.css';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState, useContext } from 'react';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const Dashboard = () => {
    const [uploadFiletext, setUploadFileText] = useState("Upload your resume (PDF)");
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDesc, setJobDesc] = useState("");
    const [result, setResult] = useState(null);

    const { userInfo } = useContext(AuthContext);

    const handleOnChangeFile = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
            setUploadFileText(e.target.files[0].name);
        }
    };

    const handleUpload = async () => {
        if (!resumeFile) {
            alert("Please upload a resume in PDF format first.");
            return;
        }
        if (!jobDesc || !jobDesc.trim()) {
            alert("Please enter or paste the target job description.");
            return;
        }
        if (!userInfo || !userInfo._id) {
            alert("User session not found. Please log in again.");
            return;
        }

        try {
            setLoading(true);
            setResult(null);

            const formData = new FormData();
            formData.append("resume", resumeFile);
            formData.append("job_desc", jobDesc);
            formData.append("user", userInfo._id);

            const res = await axios.post("/api/resume/addResume", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res.data && res.data.data) {
                setResult(res.data.data);
            }
        } catch (err) {
            console.error("Resume analysis error:", err);
            alert(err.response?.data?.message || err.response?.data?.error || err.message || "Failed to analyze resume.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.Dashboard}>
            <div className={styles.DashboardLeft}>
                <div className={styles.DashboardHeader}>
                    <div className={styles.DashboardHeaderTitle}>AI Resume Screener</div>
                    <div className={styles.DashboardHeaderLargeTitle}>Analyze your resume with AI</div>
                </div>

                <div className={styles.alertInfo}>
                    <h3 style={{ margin: "0 0 10px 0" }}>Instructions:</h3>
                    <ul className={styles.dashboardInstruction} style={{ margin: 0, paddingLeft: "20px" }}>
                        <li>Upload your resume in <strong>PDF</strong> format.</li>
                        <li>Paste the relevant <strong>Job Description</strong> in the text area below.</li>
                        <li>Click <strong>Analyze</strong> to calculate compatibility score and detailed feedback.</li>
                    </ul>
                </div>

                <div className={styles.DashboardUploadResume}>
                    <div className={styles.DashboardResumeBlock}>
                        <div className={styles.DashboardInputField}>
                            <label htmlFor="resumeUploadInput" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
                                <CreditScoreIcon sx={{ fontSize: 32, color: "#f94a6b" }} />
                                <span>{uploadFiletext}</span>
                            </label>
                            <input
                                id="resumeUploadInput"
                                type="file"
                                accept="application/pdf"
                                onChange={handleOnChangeFile}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.jobDesc}>
                    <textarea
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        className={styles.textArea}
                        placeholder="Paste the target Job Description here..."
                        rows={10}
                        cols={50}
                    />
                    <div
                        className={styles.AnalyzeBtn}
                        onClick={handleUpload}
                        style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "wait" : "pointer" }}
                    >
                        {loading ? "Analyzing..." : "Analyze"}
                    </div>
                </div>
            </div>

            <div className={styles.DashboardRight}>
                <div className={styles.DashboardRightTopCard}>
                    <div>Analyze With AI</div>

                    <img
                        className={styles.profileImg}
                        src={userInfo?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                        alt="Candidate Profile"
                    />

                    <h2>{userInfo?.name || "Candidate"}</h2>
                </div>

                {
                    result && (
                        <div className={styles.DashboardRightTopCard} style={{ marginTop: "10px", textAlign: "center" }}>
                            <div>Match Score</div>
                            <div style={{ fontSize: "44px", fontWeight: "800", color: "#f94a6b", margin: "10px 0" }}>
                                {result.score}%
                            </div>
                            <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "8px", color: "#222" }}>
                                {result.resume_name}
                            </div>
                            <div style={{
                                fontSize: "13px",
                                color: "#444",
                                textAlign: "left",
                                lineHeight: "1.6",
                                maxHeight: "220px",
                                overflowY: "auto",
                                padding: "8px",
                                background: "#fff",
                                borderRadius: "10px",
                                border: "1px solid #e0e0e0"
                            }}>
                                {result.feedback}
                            </div>
                        </div>
                    )
                }

                {
                    loading && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <Skeleton variant="rectangular" sx={{ borderRadius: "20px" }} width="100%" height={180} />
                            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default WithAuthHOC(Dashboard);
