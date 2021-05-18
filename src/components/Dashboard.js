import React, { useState, useEffect, useRef } from "react";
import { Card, Alert, Button, InputGroup, FormControl } from "react-bootstrap";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDB } from "../context/DatabaseContext";
import { useCollectionData } from "react-firebase-hooks/firestore";

function Dashboard(props) {
  const roomToAddRef = useRef();
  const roomToFindRef = useRef();
  const [error, setError] = useState("");
  const [chatRoomLink, setChatRoomLink] = useState('')
  const [chatRoomAddedLink, setChatRoomAddedLink] = useState('')
  const { currentUser, logout } = useAuth();
  const { getUserFromStore, findChatRoomById, addChatRoom,getChatRooms } = useDB();
  const [chatRoomsfromStore] = useCollectionData(getChatRooms());
  console.log(chatRoomsfromStore);
  const [user, setUser] = useState("");
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

  const addNewChatRoom = async () => {
    for(const room of chatRoomsfromStore){
      if(room['chat_room_id'] === roomToAddRef.current.value){
        return setError("Chat room name already exist");
      }
    }
    setError("");
    const res = await addChatRoom(roomToAddRef.current.value);
    setChatRoomAddedLink('Go to room: ' + roomToAddRef.current.value)
  };

  const findRoom =async  () => {
    setError('')
    const res = await findChatRoomById(roomToFindRef.current.value);
    let exist;
    const action = await res.forEach((result) => exist = result.data());
    console.log(exist);
    if(!exist){
      setChatRoomLink('');
      setError('No chat room with that name has found');
    }else{
      setError('');
      setChatRoomLink('Go to room: ' + roomToFindRef.current.value);
    }
  };

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
          <InputGroup className="mb-3">
            <FormControl
              ref={roomToAddRef}
              placeholder="Chat-room"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button onClick={addNewChatRoom } variant="outline-secondary">
                Add room
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl
              ref={roomToFindRef}
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
          {chatRoomLink && <Alert variant="success"><Link to={`/chat-room?id=${roomToFindRef.current.value}`}>{chatRoomLink}</Link></Alert>}
          {chatRoomAddedLink && <Alert variant="success"><Link to={`/chat-room?id=${roomToAddRef.current.value}`}>{chatRoomAddedLink}</Link></Alert>}
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
