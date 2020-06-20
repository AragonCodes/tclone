import React, { useState } from 'react'

const AuthContext = React.createContext()
const useAuth = () => React.useContext(AuthContext)

const AuthProvider = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    const logon = async () => {
        setLoading(true);
        setError(false);

        try {
            const res = await fetch('/auth/login');
            if (res.status >= 500) {
                throw Error(res.message);
            }
            else if (res.status >= 400) {
                logout();
            }
            else if (res.ok) {
                const {user} = await res.json();
                login(user);
            }
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    const logout = async() => {
        await fetch('/auth/logout');
        setIsAuthenticated(false);
        setUser(null);
    }

    const login = (user) => {
        setIsAuthenticated(true);
        setUser(user);
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            loading,
            user,
            error,
            login,
            logout,
            logon
        }} {...props} />
    )
}

export { AuthProvider, useAuth, AuthContext }