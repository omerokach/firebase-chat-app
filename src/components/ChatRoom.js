import React, { useEffect, useRef, useState } from "react";
import { useDB } from "../context/DatabaseContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Card, InputGroup, FormControl, Button, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import Message from "./Message";

function ChatRoom(props) {
  const textRef = useRef();
  const dummy = useRef();
  const { currentUser, logout } = useAuth();
  const { getMessages, addMessage, getUserFromStore } = useDB();
  const roomId = props.location.search.match(/(?<=\=).+/)[0];
  const [user, setUser] = useState("");

  useEffect(async () => {
    const userFromStore = await getUserFromStore(currentUser.email);
    userFromStore.forEach((user) => setUser(user.data()));
  }, []);
  //   const roomId = props.location.search.replace(/\D/g, "");

  const [messages, loading, error] = useCollectionData(getMessages(roomId));
  useEffect(() => {
      dummy.current.scrollIntoView({ behavior: "smooth" });
  },[messages])

  const sendMessage = (e) => {
    e.preventDefault();
    const text = textRef.current.value;
    if (text.length !== 0) {
        addMessage(text, roomId, user.email);
        textRef.current.value = "";
    }
  };

  return (
    <Card className="chatroom-card">
      <Card.Body>
        <h1>chat room {props.roomId}</h1>
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
            <Button type='submit' variant="outline-secondary">
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
