import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import MessageForm from "../components/MessageForm";
import "./Chat.css"

function Chat() {

    return (
        <Container className="container-main">
            <Row>
                <Col md={4} className="sidebar" >
                    <Sidebar />
                </Col>
                <Col md={8} className="chat-box ps-0" >
                    <MessageForm />
                </Col>
            </Row>
        </Container>
    );
}

export default Chat;
