import React, {useState} from 'react'
import './auth.css'
import { Link } from 'react-router-dom'
import { filterInput } from '../../utils/helpers'
import { useAuth } from '../../utils/context/auth'

const Login = () => {
    const {login: authLogin} = useAuth();

    const [disabled, setDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        try {
            event.preventDefault();
            if (disabled) return;
            
            setDisabled(true);
            setErrorMessage('');

            filterInput(username, 'username', { min_length: 4 });
            filterInput(password, 'password')

            const res = await fetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (res.status >= 500) {
                throw Error('Something went wrong')
            }
            else if (res.status >= 400) {
                throw Error('Incorrect credentials');
            }
            else if (res.ok) {
                const {user} = await res.json();
                authLogin(user);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
        } finally {
            setDisabled(false);
        }
    }

    return (
        <>
            <div className="thumb">
                <img src="img/login-thumb-vector.svg" alt="people vector" />
                <a href="https://www.freepik.com/free-photos-vectors/people">People vector created by pikisuperstar - www.freepik.com</a>
            </div>
            <div style={{}} className="title">
                See what’s happening in the fake_world right now
            </div>
            <form 
                className={`auth ${disabled ? 'disabled' : ''}`}
                onSubmit={handleLogin}
            >
                <div className="group">
                    <div className="label">Username</div>
                    <input 
                        onChange={({target: {value}}) => setUsername(value)} 
                        value={username} 
                        type="text" 
                        name="username" 
                        autoCapitalize="off" />
                </div>
                <div className="group">
                    <div className="label">Password</div>
                    <input 
                        onChange={({target: {value}}) => setPassword(value)} 
                        value={password} 
                        autoCorrect="off" 
                        type="password" 
                        name="password" 
                        />
                </div>
                <div className="links">
                    <Link to="/help">Forgot password?</Link>
                </div>
                <div className="error">
                    {errorMessage}
                </div>
                <div className="buttons">
                    <button
                        type="submit"
                        className="btn active">
                        <span>Log in</span>
                    </button>
                    <div className="seperator"><span>or</span></div>
                    <Link to="/signup"
                        className="btn passive">
                        <span>Sign up</span>
                    </Link>
                </div>
            </form>
        </>
    )
}

export default Login