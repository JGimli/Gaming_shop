import { Link } from "react-router-dom";

function Head(){
    return(
        <div>
            <div className="TitleL"><Link
            className="SiteTitle"
            to={{
              pathname:'/'  
            }}>
            <h1>Stefan Market</h1>
            </Link></div>
            <div className="LoginR"><Link 
            className="LoginScreen"
            to={{
                pathname:'/login'
            }}>
            Login
            </Link></div>
        </div>

    );
}

export default Head;