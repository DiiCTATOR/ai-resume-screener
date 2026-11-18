import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const WithAuthHOC = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();
        const { setLogin, userInfo, setUserInfo } = useContext(AuthContext);

        useEffect(() => {
            const storedLogin = localStorage.getItem('isLogin');
            const storedUserInfo = localStorage.getItem('userInfo');

            if (!storedLogin) {
                setLogin(false);
                navigate('/');
                return;
            }

            if (storedUserInfo && (!userInfo || !userInfo._id) && setUserInfo) {
                try {
                    setUserInfo(JSON.parse(storedUserInfo));
                } catch (e) {
                    console.warn("Could not parse stored user info:", e.message);
                }
            }
        }, [navigate]);

        return <WrappedComponent {...props} />;
    };
};

export default WithAuthHOC;
