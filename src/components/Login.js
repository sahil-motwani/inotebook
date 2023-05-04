import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    let navigate = useNavigate()

    const [credentials, setCredentials] = useState({ email: '', password: '' })

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        console.log(credentials)
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        })
        const json = await response.json()
        console.log(json)
        if (json.success) {
            //save the authtoken and redirect
            localStorage.setItem('token', json.authtoken)
            props.showAlert('success','Logged in successfully');
            navigate('/')
            
        } else {
            props.showAlert('danger','Invalid credentials');
        }
    }
    return (
        <div>
            <h2>Login to continue using iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name="email" onChange={onChange} value={credentials.email} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} value={credentials.password} />
                </div>
                <button type="submit" className="btn btn-primary">Log in</button>
            </form>
        </div>
    )
}

export default Login
