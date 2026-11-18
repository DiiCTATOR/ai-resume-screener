import styles from './Dashboard.module.css';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState, useContext } from 'react';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const Dashboard = () => {
    const [uploadFiletext, setUploadFileText] = useState("Upload your resume");
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
        try {
            if (!resumeFile) {
                alert("Please select a resume file");
                return;
            }
            if (!jobDesc || !jobDesc.trim()) {
                alert("Please enter a job description");
                return;
            }
            setLoading(true);
            setResult(null);

            const formData = new FormData();
            formData.append("resume", resumeFile);
            formData.append("job_desc", jobDesc);
            formData.append("user", userInfo?._id);

            const res = await axios.post('/api/resume/addResume', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setResult(res.data.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
            alert("Something went wrong with analysis");
        }
    };

    return (
        <div className={styles.Dashboard}>
            <div className={styles.DashboardLeft}>
                <div className={styles.DashboardHeader}>
                    <div className={styles.DashboardHeaderTitle}>Resume Screening</div>
                    <div className={styles.DashboardHeaderLargeTitle}>AI-Powered Screening</div>
                </div>

                <div className={styles.alertInfo}>
                    <div>Instructions:</div>
                    <div className={styles.dashboardInstruction}>
                        1. Upload your resume in PDF format.<br />
                        2. Paste the target Job Description in the text area below.<br />
                        3. Click Analyze to get your compatibility score and feedback.
                    </div>
                </div>

                <div className={styles.DashboardUploadResume}>
                    <div className={styles.DashboardResumeBlock}>
                        <label htmlFor="file-upload" className={styles.DashboardInputField} style={{ cursor: "pointer" }}>
                            <CreditScoreIcon sx={{ fontSize: 30, marginRight: 2 }} />
                            <div>{uploadFiletext}</div>
                        </label>
                        <input id="file-upload" type="file" accept="application/pdf" onChange={handleOnChangeFile} />
                    </div>
                    <div className={styles.analyzeAIBtn} onClick={handleUpload}>
                        Analyze With AI
                    </div>
                </div>

                <div className={styles.jobDesc}>
                    <textarea
                        value={jobDesc}
                        onChange={(e) => { setJobDesc(e.target.value); }}
                        className={styles.textArea}
                        placeholder="Paste Your Job Description"
                        rows={10}
                        cols={50}
                    />
                    <div className={styles.AnalyzeBtn} onClick={handleUpload}>Analyze</div>
                </div>
            </div>

            <div className={styles.DashboardRight}>
                <div className={styles.DashboardRightTopCard}>
                    <div>Analyze With AI</div>

                    <img className={styles.profileImg} src={userInfo?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} alt="Profile" />

                    <h2>{userInfo?.name || "User"}</h2>
                </div>

                {
                    result && (
                        <div className={styles.DashboardRightTopCard}>
                            <div>Result</div>
                            <h2>{result.score}%</h2>
                            <p style={{ marginTop: "10px", textAlign: "left", lineHeight: "1.5" }}>{result.feedback}</p>
                        </div>
                    )
                }

                {
                    loading && <Skeleton variant="rectangular" sx={{ borderRadius: "20px" }} width={280} height={280} />
                }
            </div>
        </div>
    );
};

export default WithAuthHOC(Dashboard);
