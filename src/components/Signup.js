import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
const Signup = (props) => {
    let navigate = useNavigate()

    const [credentials, setCredentials] = useState({name:'', email: '', password: '', cpassword:'' })

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name,email,password} = credentials;
        console.log(credentials)
        const response = await fetch('http://localhost:5000/api/auth/createuser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name,email,password })
        })
        const json = await response.json()
        console.log(json)
        if (json.success) {
            //save the authtoken and redirect
            localStorage.setItem('token', json.authtoken)
            props.showAlert('success','Sign up successfull')
            navigate('/')
        } else {
            props.showAlert('danger','Enter proper details')
        }
    }
    return (
        <div className='container'>
            <h2>Signup to start using iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" aria-describedby="emailHelp" name="name" onChange={onChange} value={credentials.name} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name="email" onChange={onChange} value={credentials.email} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} value={credentials.password} required minLength={5}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} value={credentials.cpassword} required minLength={5}/>
                </div>
                <button type="submit" className="btn btn-primary">Sign up</button>
            </form>
        </div>
    )
}

export default Signup
