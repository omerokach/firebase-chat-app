import React, { useState } from "react";
import { Card, Alert, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDB } from "../context/DatabaseContext";
import ChatRoom from "./ChatRoom";

function Dashboard(props) {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const {getUserFromStore} = useDB();
  const [chatRoomsArray, setChatRoomsArray] = useState([1]);
  const [user, setUser] = useState(getUserFromStore(currentUser.email))

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

  const addChatRoom = () => {
    console.log(chatRoomsArray.length);
    if (chatRoomsArray.length === 5) {
      return setError("Max rooms is 5");
    }
    setError("");
    setChatRoomsArray((prev) => [...prev, prev[prev.length]]);
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>hello: </strong>
          {currentUser.email}
          {chatRoomsArray.map((chatRoom, i) => (
            <div className="text-center mb-4">
              <Link to={`/chat-room?id=${i + 1}`} key={i}>
                Chat room {i + 1}
              </Link>
            </div>
          ))}
          <Button onClick={addChatRoom}>Add room</Button>
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
