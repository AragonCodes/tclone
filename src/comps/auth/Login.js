import React from 'react'
import './auth.css'
import { Link } from 'react-router-dom'
import { filterInput } from '../../utils/helpers'
import { AuthContext } from '../../utils/context/auth'

class Login extends React.Component {
    static contextType = AuthContext;
    state = {
        error: null,
        password: 'test',
        username: 'test'
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ error: null })
        try {
            let form = e.target;
            let username = filterInput(form.username.value, 'username', { min_length: 4 });
            let password = filterInput(form.password.value, 'password')
            let responce = await fetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // console.log(responce);
            if (responce.status >= 500) {
                throw Error('Something went wrong.')
            }
            else if (responce.status >= 400) {
                throw Error('Incorrect credentials');
            }
            else if (responce.ok) {
                let data = await responce.json();
                console.log(data.message);
                this.context.login(data.user);
            }
        } catch (error) {
            console.log(error.message);
            this.setState({ error: error.message })
        }
    }
    render() {
        return (
            <form action='/login' onSubmit={this.handleSubmit} className="auth" method="POST">
                <div className="group">
                    <div className="label">Username</div>
                    <input onChange={this.handleChange} value={this.state.username} type="text" name="username" autoCapitalize="off" />
                </div>
                <div className="group">
                    <div className="label">Password</div>
                    <input onChange={this.handleChange} value={this.state.password} autoCorrect="off" type="password" name="password" id="" />
                </div>
                <div className="links">
                    <Link to="/help">Forgot password?</Link>
                </div>
                <div className="error">
                    {this.state.error}
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
        )
    }
}
export default Login