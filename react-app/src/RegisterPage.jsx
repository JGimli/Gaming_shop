import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const API_URL = 'http://localhost:3000';

function Register(){
    const navigate = useNavigate();
    const { startSession } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (password !== repeatPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(`${API_URL}/register`, { username, email, password });
            startSession(response.data);
            navigate('/', { replace: true });
        } catch (requestError) {
            setError(
                requestError.response?.data?.error ||
                'Could not create your account. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
       <main className="auth-page">
        <section className="auth-panel" aria-labelledby="register-heading">
         <h1 id="register-heading">Create account</h1>
         <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="register-username">User name</label>
          <input
           id="register-username"
           type="text"
           autoComplete="username"
           value={username}
           onChange={(event) => setUsername(event.target.value)}
           required
           minLength={3}
           maxLength={100}
          />
          <label htmlFor="register-email">Email address</label>
          <input
           id="register-email"
           type="email"
           autoComplete="email"
           value={email}
           onChange={(event) => setEmail(event.target.value)}
           required
           maxLength={255}
          />
          <label htmlFor="register-password">Password</label>
          <input
           id="register-password"
           type="password"
           autoComplete="new-password"
           value={password}
           onChange={(event) => setPassword(event.target.value)}
           required
           minLength={8}
           maxLength={100}
          />
          <label htmlFor="register-repeat-password">Repeat password</label>
          <input
           id="register-repeat-password"
           type="password"
           autoComplete="new-password"
           value={repeatPassword}
           onChange={(event) => setRepeatPassword(event.target.value)}
           required
           minLength={8}
           maxLength={100}
          />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
           {isSubmitting ? 'Registering…' : 'Register'}
          </button>
          <div className="auth-links">
           <Link className="auth-link" to="/login">Back to login</Link>
          </div>
         </form>
        </section>
       </main>
    );
}
export default Register;