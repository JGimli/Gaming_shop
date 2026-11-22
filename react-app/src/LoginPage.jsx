import { Link } from 'react-router-dom'

function Login(){
    return(
       <main className="auth-page">
        <section className="auth-panel" aria-labelledby="login-heading">
         <h1 id="login-heading">Log in</h1>
         <div className="auth-form">
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" type="email" autoComplete="email" />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" />
          <button className="auth-submit" type="button">Log in</button>
          <div className="auth-links">
           <Link className="auth-link-button" to="/">Back</Link>
           <button className="auth-link-button" type="button">Forgot password?</button>
           <Link className="auth-link-button" to="/register">Register</Link>
          </div>
         </div>
        </section>
       </main>
    );
}
export default Login;
