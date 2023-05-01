import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import AuthenticationContext from '../../providers/AuthenticationProvider';

import './style.css';
import logo from '../../assets/RestifyWhite.png';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthenticationContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                'http://localhost:8000/accounts/login/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                login();
                navigate('/');
                // reload the page
                window.location.reload();
            } else {
                setError('Incorrect username or password');
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="body">
            <div className="logo-div-login">
                <img className="logo-login" src={logo} alt="The logo" />
            </div>

            <div className="center">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="txt_field">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <span></span>
                        <label>Username</label>
                    </div>
                    <div className="txt_field">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span></span>
                        <label>Password</label>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button
                        type="submit"
                        id="login-btn"
                        className="btn btn-primary btn-lg"
                    >
                        Login
                    </button>
                    <div className="signup_link">
                        Not a member? <Link to="/signup">Signup</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
