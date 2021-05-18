import React, { useState, useEffect, useRef, forwardRef } from "react";
import {
  Card,
  Alert,
  Button,
  InputGroup,
  FormControl,
  FormLabel,
  Form,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDB } from "../context/DatabaseContext";
import { useCollectionData } from "react-firebase-hooks/firestore";

function Dashboard(props) {
  const [show, setShow] = useState(false);
  const roomToAddRef = useRef();
  const roomToFindRef = useRef();
  const roomToAddPassRef = useRef();
  const userToInviteRef = useRef();
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [inviteLink, setInviteLink] = useState();
  const [addRoomError, setAddRoomError] = useState("");
  const [chatRoomLink, setChatRoomLink] = useState("");
  const [chatRoomAddedLink, setChatRoomAddedLink] = useState("");
  const { currentUser, logout } = useAuth();
  const [userInvitedArray, setUserInvitedArray] = useState([]);
  const { getUserFromStore, findChatRoomById, addChatRoom, getChatRooms } =
    useDB();
  const [chatRoomsfromStore] = useCollectionData(getChatRooms());
  const [user, setUser] = useState("");

  const handleClose = () => {
    setUserInvitedArray([]);
    setShow(false);
  };

  const handleShow = () => {
    setChatRoomAddedLink("");
    setShow(true);
  };

  useEffect(async () => {
    const userFromStore = await getUserFromStore(currentUser.email);
    userFromStore.forEach((user) => setUser(user.data()));
  }, [currentUser.email]);

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

  const addNewChatRoom = async (e) => {
    e.preventDefault();
    setAddRoomError("");
    if (!roomToAddRef.current.value) {
      return setAddRoomError("Room must have a name");
    }
    if (!roomToAddPassRef.current.value) {
      return setAddRoomError("Room must have a password");
    }
    if (userInvitedArray.length < 1) {
      return setAddRoomError("You must invite at least 1 friend");
    }
    for (const room of chatRoomsfromStore) {
      if (room["chat_room_name"] === roomToAddRef.current.value) {
        return setAddRoomError("Chat room name already exist");
      }
    }
    const allowedUsers = userInvitedArray;
    setError("");
    allowedUsers.push(user.email);
    const res = await addChatRoom(
      roomToAddRef.current.value,
      user.email,
      roomToAddPassRef.current.value,
      allowedUsers
    );
    setChatRoomAddedLink("Go to room: " + roomToAddRef.current.value);
    setUserInvitedArray([]);
    const invationUrl = `${document.location.host}/chat-room?id=${roomToAddRef.current.value}`;
    console.log(invationUrl);
    setChatRoomAddedLink(invationUrl);
    // setShow(false);
  };

  const findRoom = async () => {
    setError("");
    const res = await findChatRoomById(roomToFindRef.current.value);
    let exist;
    const action = await res.forEach((result) => (exist = result.data()));
    console.log(exist);
    if (!exist) {
      setChatRoomLink("");
      setError("No chat room with that name has found");
    } else {
      setError("");
      setChatRoomLink("Go to room: " + roomToFindRef.current.value);
    }
  };

  const inviteUsersHandler = async (e) => {
    const allowedUsers = userInvitedArray;
    if (!userToInviteRef.current.value) {
      return setAddRoomError("You cant invite blank field right?");
    }
    const userToInvite = userToInviteRef.current.value;
    const userFromStore = await getUserFromStore(userToInvite);
    let ifUserExist = {};
    userFromStore.forEach((user) => (ifUserExist = user.data()));
    if (!ifUserExist.email) {
      return setAddRoomError(
        userToInvite +
          "is not assign to the app, You can only invite assigned users"
      );
    }
    setUserInvitedArray((prev) => [...prev, userToInviteRef.current.value]);
    userToInviteRef.current.value = "";
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
              alt="profile-img"
            ></img>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Button variant="outline-secondary" onClick={handleShow}>
              Add room
            </Button>
            <Modal
              animation={false}
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Form onSubmit={addNewChatRoom}>
                <Modal.Header>
                  <Modal.Title>Add room form</Modal.Title>
                  {addRoomError && (
                    <Alert variant="danger">{addRoomError}</Alert>
                  )}
                </Modal.Header>
                <Modal.Body>
                  <Form.Group controlId="formGroupEmail">
                    <Form.Label>Chat room name</Form.Label>
                    <Form.Control
                      ref={roomToAddRef}
                      type="text"
                      placeholder="Enter name"
                    />
                  </Form.Group>
                  <Form.Group controlId="formGroupPassword">
                    <Form.Label>Chat room password</Form.Label>
                    <Form.Control
                      ref={roomToAddPassRef}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>
                  <Form.Group controlId="formGroupInvite">
                    <InputGroup className="mb-3 mt-3">
                      <FormControl
                        ref={userToInviteRef}
                        placeholder="User to invite by email"
                        aria-label="User to invite by email"
                        aria-describedby="basic-addon2"
                      />
                      <InputGroup.Append>
                        <Button
                          onClick={inviteUsersHandler}
                          variant="outline-secondary"
                        >
                          ➕{" "}
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>
                  <div>
                    <strong>List of invited mails:</strong>
                    {userInvitedArray?.map((email, i) => {
                      return <span key={i}> {email} </span>;
                    })}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Add room
                  </Button>
                </Modal.Footer>
              </Form>
              {chatRoomAddedLink && (
                <Alert variant="success">
                  <p>password to the room: {roomToAddPassRef}</p> 
                  Link for invatation: {chatRoomAddedLink}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(chatRoomAddedLink);
                      setCopied("Copied!");
                    }}
                  >
                    {" "}
                    📋{" "}
                  </button>
                  {copied}
                </Alert>
              )}
            </Modal>
          </div>
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
          {chatRoomLink && (
            <Alert variant="success">
              <Link to={`/chat-room?id=${roomToFindRef.current.value}`}>
                {chatRoomLink}
              </Link>
            </Alert>
          )}
          {chatRoomAddedLink && (
            <Alert variant="success">
              <Link to={`/chat-room?id=${roomToAddRef.current.value}`}>
                {chatRoomAddedLink}
              </Link>
            </Alert>
          )}
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
