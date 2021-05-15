import React, {useState} from "react";
import { Card,Alert, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { useAuth } from "../context/AuthContext";

function Dashboard(props) {
  const [error, setError] = useState('')
  const {currentUser, logout} = useAuth();
  const history = useHistory();
  const handleLogOut = async () => {
    setError('');
    try {
      await logout();
      history.push('/login')
    } catch (error) {
      setError('Failed to log out')
    }
  }
  return (
    <>
      <Card>
        <Card.Body>
        <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong>{currentUser.email}
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant='link' onClick={handleLogOut}>Log Out</Button>
      </div>
    </>
  );
}

export default Dashboard;
