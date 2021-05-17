import React, { useContext, useState, useEffect } from "react";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";
import app from "../firebase";
const DatabaseContext = React.createContext();

export function useDB() {
  return useContext(DatabaseContext);
}

const db = app.firestore();

export function DataBaseProvider({ children }) {
  const massagesRef = db.collection("messages");
  const usersRef = db.collection("users");

  const getMessages = (chatRoomId) => {
    return massagesRef
      .where("chat_room_id", "==", chatRoomId)
      .orderBy("created_at");
  };

  const addUserProfileImg = async (email, imgfile) => {
    try {
      const res = await app
        .storage()
        .ref("users/" + `${email}-profile.jpg`)
        .put(imgfile);
      console.log("uploaded successfuly");
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserFromStore = async (userEmail) => {
    const res = await usersRef.where("email", "==", userEmail).get();
    return res;
  };

  const getUserProfileImg = async (user) => {
    try {
      const imgUrl = await app
        .storage()
        .ref("users/" + `${user.email}-profile.jpg`)
        .getDownloadURL();
      return imgUrl;
    } catch (error) {
      console.log(error.message);
    }
  };

  const signupUserOnStore = async (user) => {
    console.log(user);
    const imgUrl = await getUserProfileImg(user);
    user.imgUrl = imgUrl;
    const res = await usersRef.add(user);
    console.log(res);
  };

  const addMessage = (message, chatroom_id, name, imgUrl, senderEmail) => {
    console.log(message, chatroom_id, name);
    const newMessage = {
      sender: name,
      senderEmail: senderEmail,
      chat_room_id: chatroom_id,
      imgUrl: imgUrl,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      text: message,
    };
    massagesRef.add(newMessage);
  };

  const findChatRoomById = async (chatRoomId) => {
    return db.collection('messages').where('chat_room_id', '==', chatRoomId).limit(1).get();
}

const getChatRooms = () => {
  return db.collection('chatRooms');
}

const addChatRoom = (chatRoomId ) => {
  const newChatRoom = {
    chat_room_id: chatRoomId
  }
  return db.collection('chatRooms').add(newChatRoom);
}

  const value = {
    signupUserOnStore,
    getUserProfileImg,
    addUserProfileImg,
    getMessages,
    getUserFromStore,
    addMessage,
    findChatRoomById,
    addChatRoom,
    getChatRooms
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}
