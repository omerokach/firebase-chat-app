import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDB } from "../context/DatabaseContext";

function Message({ message }) {
  const [user, setUser] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const { currentUser, logout } = useAuth();
  const { getUserFromStore } = useDB();
  useEffect(() => {
    currentUser.email === message.senderEmail
      ? setMessageClass("my-message")
      : setMessageClass("");
  }, []);

  useEffect(async () => {
    const userFromStore = await getUserFromStore(currentUser.email);
    userFromStore.forEach((user) => setUser(user.data()));
  }, []);

  return (
    <div className={`message ${messageClass}`}>
      {messageClass === "my-message" ? (
        <>
          <div className="msg-container">
            <strong>{message.sender}:</strong> {message.text}
          </div>
          <img
            className="profile-img"
            src={message.imgUrl}
            alt="profile-img"
          ></img>
        </>
      ) : (
        <>
          <img
            className="profile-img"
            src={message.imgUrl}
            alt="profile-img"
          ></img>
          <div className="msg-container">
            {message.text} <strong>:{message.sender}</strong>
          </div>
        </>
      )}
    </div>
  );
}

export default Message;
