import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

const Blank = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const access_token = localStorage.getItem("TOKEN")
        if (access_token) {
            navigate("/")
        }
    }, [])
    // Check neu co token trong local storage thi redirect sang Table user
    return <>
        <Navbar bg="light" expand="lg">
            <Container>
            {/* <Navbar.Brand as={Link} to="/">Home</Navbar.Brand> */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
        <Outlet />
    </>
}
export default Blank