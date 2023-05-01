import React, { createContext, useState } from 'react';

const AuthenticationContext = createContext({
    token: {},
    user: {},
});

export const AuthenticationProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tokens, setTokens] = useState({ refresh: '', access: '' });
    const [user, setUser] = useState({});

    const login = () => {
        fetch('http://localhost:8000/accounts/profile/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('avatar', data.avatar);
                setUser(data);
            });
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setTokens({ refresh: '', access: '' });
        setUser({});
    };

    return (
        <AuthenticationContext.Provider
            value={{ isLoggedIn, tokens, user, login, logout }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
};

export default AuthenticationContext;
