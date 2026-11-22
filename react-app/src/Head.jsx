import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

function Head(){
    const { user, endSession } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        endSession();
        navigate('/', { replace: true });
    };

    return(
        <div>
            <div className="TitleL"><Link
            className="SiteTitle"
            to={{
              pathname:'/'  
            }}>
            <h1>Stefan Market</h1>
            </Link></div>
            <div className="LoginR">
            {user ? (
                <button className="LoginScreen" type="button" onClick={handleLogout}>
                    Logout
                </button>
            ) : (
                <Link className="LoginScreen" to="/login">
                    Log in
                </Link>
            )}
            </div>
        </div>

    );
}

export default Head;