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
                <>
                    <h2>{user.username}</h2>
                    <button className="LoginScreen" type="button" onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                <h2>Guest</h2>
                <Link className="LoginScreen" to="/login">
                    Log in
                </Link>
                </>
            )}
            </div>
        </div>

    );
}

export default Head;