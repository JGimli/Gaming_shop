import { Link } from 'react-router-dom'

function Register(){
    return(
       <main className="auth-page">
        <section className="auth-panel" aria-labelledby="register-heading">
         <h1 id="register-heading">Create account</h1>
         <div className="auth-form">
          <label htmlFor="register-username">User name</label>
          <input id="register-username" type="text" autoComplete="username" />
          <label htmlFor="register-email">Email address</label>
          <input id="register-email" type="email" autoComplete="email" />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" type="password" autoComplete="new-password" />
          <label htmlFor="register-repeat-password">Repeat password</label>
          <input id="register-repeat-password" type="password" autoComplete="new-password" />
          <button className="auth-submit" type="button">Register</button>
          <div className="auth-links">
           <Link className="auth-link-button" to="/login">Back to login</Link>
          </div>
         </div>
        </section>
       </main>
    );
}
export default Register;