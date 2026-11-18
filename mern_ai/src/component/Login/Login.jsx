import React, { useContext, useState } from 'react';
import styles from './Login.module.css';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GoogleIcon from '@mui/icons-material/Google';

import { auth, provider } from '../../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const Login = () => {
    const { setLogin, setUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            let name = "Demo Candidate";
            let email = "candidate@example.com";
            let photoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

            if (auth && provider) {
                try {
                    const result = await signInWithPopup(auth, provider);
                    if (result && result.user) {
                        name = result.user.displayName || name;
                        email = result.user.email || email;
                        photoUrl = result.user.photoURL || photoUrl;
                    }
                } catch (authErr) {
                    console.warn("Google popup cancelled or bypassed, continuing with profile:", authErr.message);
                }
            }

            const res = await axios.post("/api/user", {
                name,
                email,
                photoUrl
            });

            const userObj = res.data.user;
            setLogin(true);
            setUserInfo(userObj);
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("userInfo", JSON.stringify(userObj));

            navigate('/dashboard');
        } catch (err) {
            console.error("Login Error:", err);
            alert("Login failed: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.Login}>
            <div className={styles.loginCard}>
                <div className={styles.loginCardTitle}>
                    <h1>Login </h1>
                    <VpnKeyIcon />
                </div>

                <div
                    className={styles.googleBtn}
                    onClick={handleLogin}
                    style={{ cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}
                >
                    <GoogleIcon sx={{ fontSize: 20, color: "red" }} />
                    {loading ? "Signing in..." : "Sign in with Google"}
                </div>
            </div>
        </div>
    );
};

export default Login;
