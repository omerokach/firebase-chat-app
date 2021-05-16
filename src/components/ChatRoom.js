import React, { useEffect, useRef, useState } from "react";
import { useDB } from "../context/DatabaseContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Card, InputGroup, FormControl, Button } from "react-bootstrap";
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
  console.log(messages);

  const sendMessage = () => {
    const text = textRef.current.value;
    if (text.length !== 0) {
        addMessage(text, roomId, user.email);
        textRef.current.value = "";
        dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Card className="chatroom-card">
      <Card.Body>
        <h1>chat room {props.roomId}</h1>
        <div className="chat-board" style={{ height: "28rem" }}>
          {messages &&
            messages.map((msg, i) => <Message message={msg} key={i} />)}
        </div>
        <div ref={dummy}></div>
        <InputGroup className="mb-3">
          <FormControl
            ref={textRef}
            placeholder="Recipient's username"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <InputGroup.Append>
            <Button onClick={sendMessage} variant="outline-secondary">
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Card.Body>
    </Card>
  );
}

export default ChatRoom;
