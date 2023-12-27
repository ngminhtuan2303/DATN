import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logIn } from '../../services/AdminUserService';
import {Form, Button} from 'react-bootstrap'

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

    const login = () => {
        console.log(email, password)
        logIn(email, password).then(res => {
            console.log(res)
            localStorage.setItem("TOKEN", res.data.access_token)
            navigate("/users")
        }).catch((e) => {
            toast.error(`Email or Password is incorrect!`)
        })
    }
    return <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '30vh',
        margin: '50px 300px 300px 300px'
      }}> 
        
        <Form>
        <h2>Login</h2>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Check
                type="checkbox"
                label="Show Password"
                onChange={() => setShowPassword(!showPassword)}
              />
            </Form.Group>
            <Button onClick={() => login()}>Login</Button>
          </Form>
        
    </div>
}
export default LoginPage