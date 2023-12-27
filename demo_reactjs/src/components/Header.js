import { Outlet, Link, useNavigate } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useEffect } from "react";
import { Button } from "react-bootstrap";

const Header = () => {
  // Check local storage => token => chua co token => redirect ve Login
  const navigate = useNavigate()
  useEffect(() => {
      // const access_token = localStorage.getItem("TOKEN")
      // console.log(access_token)
      // if (!access_token) {
      //   // navigate("/login")
      //   navigate("/")
      // }
      const checkToken = async () => {
        try {
          const access_token = localStorage.getItem("TOKEN");
          console.log(access_token);
          
          if (!access_token) {
            navigate("/");
          }
  
          // You can add more token validation logic here if needed
  
        } catch (error) {
          console.error('Token validation error:', error);
  
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("TOKEN")
            // Redirect to login page if 401 Unauthorized
            navigate("/");
          }
        }
      };
  
      checkToken();
  }, [navigate])
  const onLogout = () => {
    localStorage.removeItem("TOKEN")
    // navigate("/login")
    navigate("/")
  }
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          {/* <Navbar.Brand as={Link} to="/">Home</Navbar.Brand> */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/users">Users</Nav.Link>
              <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
              {/* <Nav.Link as={Link} to="/facesearch">FaceSearch</Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
        
        <Button onClick={onLogout}> Logout </Button>
      </Navbar>
      
      <Outlet />
      
    </>
  )
};

export default Header;
