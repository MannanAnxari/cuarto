import React, { useContext, useState } from "react";
import { Col, Container, Alert, Form, Row, Button, Spinner } from "react-bootstrap";
import { useLoginUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { AppContext } from "../context/appContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { socket } = useContext(AppContext);
    const [loginUser, { isLoading, error }] = useLoginUserMutation();
    function handleLogin(e) {
        e.preventDefault();
        // login logic
        loginUser({ email, password }).then(({ data }) => {
            if (data) {
                // socket work
                socket.emit("new-user");
                // navigate to the chat
                navigate("/chat");
            }
        });
    }

    return (
        <Container>
            {/* <Row  className="wrapper" > */}
            {/* <Col md={5} className="login__bg"></Col> */}
            {/* <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column"> */}
            {/* <Form style={{ }} onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            {error && <p className="alert alert-danger">{error.data}</p>}
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                            <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {isLoading ? <Spinner animation="grow" /> : "Login"}
                        </Button>
                        <div className="py-4">
                            <p className="signup text-center">
                                Don't have an account ? <Link to="/signup">Signup</Link>
                            </p>
                        </div>
                    </Form> */}
            {/* </Col> */}
            {/* </Row> */}
            {/* {error && <p className="alert alert-danger">{error.data}</p>} */}
            {/* {error && <div className="alert alert-warning alert-dismissible fade show" role="alert" dismiss><strong>Warning! </strong>{error.data}</div>} */}
            {error && <div class="alert alert-warning alert-dismissible fade show" role="alert"><strong>Warning!  </strong>{error.data}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>}
            <div className="container ">
                <div className="wrapper" >

                    <div className="logo">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/1e/RPC-JP_Logo.png" alt="" />
                    </div>
                    <div className="text-center mt-4 name text-white">
                        Oscuro Room
                    </div>
                    <form className="p-3 pt-5" onSubmit={handleLogin}>
                        <div className="form-field d-flex align-items-center">
                            <span className="text-light opacity-50 fa fa-user"></span>
                            <input type="email" name="email" id="join" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" required />
                        </div>
                        <div className="form-field d-flex align-items-center">
                            <span className="text-light opacity-50 fa fa-key"></span>
                            <input type="password" name="password" id="join" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password" required />
                        </div>
                        <Button variant="danger" className="border-0" type="submit">
                            {isLoading ? <Spinner animation="grow" /> : "Login"}
                        </Button>
                        <div className="py-4">
                            <p className="signup text-center">
                                Don't have an account ? <Link to="/signup">Signup</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </Container>
    );
}

export default Login;
