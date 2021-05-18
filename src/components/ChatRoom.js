import React, { useEffect, useRef, useState } from "react";
import { useDB } from "../context/DatabaseContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  Card,
  InputGroup,
  FormControl,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import Message from "./Message";
import { useHistory } from "react-router";

function ChatRoom(props) {
  const [uiError, setUiError] = useState("");
  const textRef = useRef();
  const dummy = useRef();
  const history = useHistory();
  const { currentUser, logout } = useAuth();
  const { getMessages, addMessage, getUserFromStore } = useDB();
  const roomId = props.location.search.match(/(?<==).+/)[0];
  //   const roomId = props.location.search.replace(/\D/g, "");
  const [user, setUser] = useState("");

  useEffect(async () => {
    const userFromStore = await getUserFromStore(currentUser.email);
    userFromStore.forEach((user) => setUser(user.data()));
  }, []);

  const [messages, loading, error] = useCollectionData(getMessages(roomId));
  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const text = textRef.current.value;
    if (text.length !== 0) {
      addMessage(text, roomId, user.name, user.imgUrl, user.email);
      textRef.current.value = "";
    }
  };

  const handleLogOut = async () => {
    setUiError("");
    try {
      await logout();
      history.push("/login");
    } catch (error) {
      setUiError("Failed to log out");
    }
  };

  const handleChangeRoom = () => {
    history.push("/");
  }


  return (
    <Card className="chatroom-card">
      <Card.Body>
        <div className="chat-room-navbar">
          <h1>chat room {props.roomId}</h1>
          {uiError && <Alert variant="danger">{uiError}</Alert>}
          <Button className="w-10 m-2" onClick={handleLogOut}>
            Logout
          </Button>
          <Button className="w-15 m-2" onClick={handleChangeRoom}>
            Change-room
          </Button>
        </div>
        <div className="chat-board" style={{ height: "28rem" }}>
          {messages &&
            messages.map((msg, i) => <Message message={msg} key={i} />)}
          <div ref={dummy}></div>
        </div>
        <Form onSubmit={sendMessage}>
          <InputGroup className="mb-3">
            <FormControl
              ref={textRef}
              placeholder="message"
              aria-label="message"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button type="submit" variant="outline-secondary">
                Send
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ChatRoom;
