import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDB } from "../context/DatabaseContext";

function Message({ message }) {
  const [user, setUser] = useState("");
  const { currentUser, logout } = useAuth();
  const { getUserFromStore } = useDB();

  useEffect(async () => {
    const userFromStore = await getUserFromStore(currentUser.email);
    userFromStore.forEach((user) => setUser(user.data()));
  }, []);

  return (
    <div className="message">
      <img
        className="profile-img"
        src={user.imgUrl}
        style={{ maxWidth: "100", maxHeight: "3vh" }}
      ></img>
      <p>{message.text}</p>
      <footer>{user.name}</footer>
    </div>
  );
}

export default Message;
