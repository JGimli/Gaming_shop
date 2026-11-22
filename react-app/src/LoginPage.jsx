import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const API_URL = 'http://localhost:3000';

function Login(){
    const navigate = useNavigate();
    const { startSession } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            startSession(response.data);
            navigate('/', { replace: true });
        } catch (requestError) {
            setError(
                requestError.response?.data?.error ||
                'Could not log in. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
       <main className="auth-page">
        <section className="auth-panel" aria-labelledby="login-heading">
         <h1 id="login-heading">Log in</h1>
         <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email address</label>
          <input
           id="login-email"
           type="email"
           autoComplete="email"
           value={email}
           onChange={(event) => setEmail(event.target.value)}
           required
           maxLength={255}
          />
          <label htmlFor="login-password">Password</label>
          <input
           id="login-password"
           type="password"
           autoComplete="current-password"
           value={password}
           onChange={(event) => setPassword(event.target.value)}
           required
           minLength={8}
           maxLength={100}
          />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
           {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
          <div className="auth-links">
           <Link className="auth-link" to="/">Back</Link>
           <Link className="auth-link" to="/forgot-password">Forgot password?</Link>
           <Link className="auth-link" to="/register">Register</Link>
          </div>
         </form>
        </section>
       </main>
    );
}
export default Login;
