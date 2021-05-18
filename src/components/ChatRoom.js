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
  const [isUserAllowed, setIsUserAllowed] = useState(false);
  const [uiError, setUiError] = useState("");
  const [ifUserExist, setIfUserExist] = useState(false)
  const [error, setError] = useState("");
  const [roomPass, setRoomPass] = useState();
  const textRef = useRef();
  const passwordRef = useRef();
  const dummy = useRef();
  const history = useHistory();
  const { currentUser, logout } = useAuth();
  const { getMessages, addMessage, getUserFromStore, getChatRoomByName } =
    useDB();
  const roomId = props.location.search.match(/(?<==).+/)[0];
  //   const roomId = props.location.search.replace(/\D/g, "");
  const [user, setUser] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(roomPass !== passwordRef.current.value){
      setError('Inccorect password')
      setTimeout(() => {
        setError('')
      }, 2000)
    }else{
      setIsUserAllowed(true); 
    }
  };

  useEffect(async () => {
    let res = await getChatRoomByName(roomId);
    let room = "";
    res.forEach((roomFromStore) => (room = roomFromStore.data()));
    if(!room){
      return setUiError('Sorry no room with that name')
    }
    setRoomPass(room.password);
    const userFromStore = await getUserFromStore(roomId);
    userFromStore.forEach((user) => {
      setUser(user.data());
    });
    let ifUserExist = room.users.includes(currentUser.email);
    if (!ifUserExist) {
      return setUiError("You are not alowed to enter the room, get invtation");
    }
  }, []);

  const [messages, loading] = useCollectionData(getMessages(roomId));
  useEffect(() => {
    if (isUserAllowed) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
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
  };

  return (
    <>
      {!isUserAllowed ? (
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In to chatroom</h2>
            {uiError ? (
              <>
              <Alert variant="danger">
                {uiError}{" "}
              </Alert>
                <Button className="w-15 m-2" onClick={handleChangeRoom}>
                  Change-room
                </Button>
              </>
            ) : (
              <>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      ref={passwordRef}
                      required
                    ></Form.Control>
                  </Form.Group>
                  <Button disabled={loading} className="w-100" type="submit">
                    Log In
                  </Button>
                </Form>
              </>
            )}
          </Card.Body>
        </Card>
      ) : (
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
      )}
    </>
  );
}

export default ChatRoom;
