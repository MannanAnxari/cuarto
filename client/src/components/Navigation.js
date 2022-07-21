import React from "react";
import { Nav, Navbar, Container, Button, NavDropdown } from "react-bootstrap";
import { BrowserRouter, Link } from "react-router-dom";
import { useLogoutUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import "./Nav.css";

function Navigation() {
    const user = useSelector((state) => state.user);
    const [logoutUser] = useLogoutUserMutation();
    async function handleLogout(e) {
        e.preventDefault();
        await logoutUser(user);
        // redirect to home page
        window.location.replace("/");
    }
    return (
        <Navbar bg="dark" expand="lg">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        {/* <img src={logo} style={{ width: 50, height: 50 }} /> */}
                        <a className="navbar-brand text-danger" href="/">D&nbsp;&nbsp;A&nbsp;&nbsp;R&nbsp;&nbsp;K</a>
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto text-light navContainer">
                        {!user && (
                            <LinkContainer to="/login">
                                <Nav.Link className="show-links"> <span className="opacity-75 text-danger">#</span>Login</Nav.Link>
                            </LinkContainer>
                        )}
                        <LinkContainer to="/chat">
                            <Nav.Link className="show-links"> <span className="opacity-75 text-danger">#</span>Chat</Nav.Link>
                        </LinkContainer>
                        {user && (
                            <NavDropdown
                                title={
                                    <>
                                        <img src={user.picture} style={{ width: 30, height: 30, marginRight: 10, objectFit: "cover", borderRadius: "50%" }} />
                                        <div className="show-links d-inline">{user.name}</div>
                                    </>
                                }
                                id="basic-nav-dropdown"
                            >
                                <Link to="/profile" className='profile dropdown-item'>Profile</Link>

                                <NavDropdown.Item className="mx-auto" onClick={handleLogout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
