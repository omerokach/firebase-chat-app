import React, { useState, useEffect, useRef } from "react";
import { Card, Alert, Button, InputGroup, FormControl } from "react-bootstrap";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDB } from "../context/DatabaseContext";
import ChatRoom from "./ChatRoom";

function Dashboard(props) {
  const roomToAddRef = useRef();
  const roomtoFindRef = useRef();
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const { getUserFromStore } = useDB();
  const [chatRoomsArray, setChatRoomsArray] = useState([]);
  const [user, setUser] = useState("");
  console.log(chatRoomsArray);
  useEffect(async () => {
    const userFromStore = await getUserFromStore(currentUser.email);
    userFromStore.forEach((user) => setUser(user.data()));
  }, []);

  const history = useHistory();
  const handleLogOut = async () => {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch (error) {
      setError("Failed to log out");
    }
  };

  const deleteRoom = (roomIndex) => {
    let roomArray = [...chatRoomsArray];
    roomArray = roomArray.splice(roomIndex,1)
    setChatRoomsArray(roomArray);
  };

  const addChatRoom = () => {
    if (chatRoomsArray.length === 5) {
      return setError("Max rooms is 5");
    }
    setError("");
    console.log(roomToAddRef.current.value);
    console.log(roomToAddRef);
    setChatRoomsArray((prev) => [...prev, roomToAddRef.current.value]);
  };

  const findRoom = () => {};

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="profile-details">
            <strong>hello: </strong> {user.name}
            <img
              className="profile-img"
              src={user.imgUrl}
              style={{ width: "50px", height: "50px" }}
            ></img>
          </div>
          {chatRoomsArray &&
            chatRoomsArray.map((chatRoom, i) => (
              <div className="text-center mb-4">
                <Link to={`/chat-room?id=${chatRoom}`} key={i}>
                  Chat room: {chatRoom}
                </Link>
                <Button onClick={() => deleteRoom(i)}>
                  Delete
                </Button>
              </div>
            ))}
          <InputGroup className="mb-3">
            <FormControl
              ref={roomToAddRef}
              placeholder="Chat-room"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button onClick={addChatRoom} variant="outline-secondary">
                Add room
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl
              ref={roomtoFindRef}
              placeholder="Chat-room"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button onClick={findRoom} variant="outline-secondary">
                find room
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogOut}>
          Log Out
        </Button>
      </div>
    </>
  );
}

export default Dashboard;
