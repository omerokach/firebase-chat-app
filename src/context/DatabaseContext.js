import React, { useContext, useState, useEffect } from "react";
import firebase from "firebase";
import "firebase/firestore";
const firestore = firebase.firestore();
const storage = firebase.storage();
const DatabaseContext = React.createContext();

export function useDB() {
  return useContext(DatabaseContext);
}

export function DataBaseProvider({ children }) {
  const massagesRef = firestore.collection("messages");
  const usersRef = firestore.collection("users");
  const storageRef = storage.ref("users/");

  const getMessages = async (chatRoom) => {
    const messages = await massagesRef
      .where("chat_room_id", "==", chatRoom.id)
      .get();
    return messages;
  };

  const addUserProfileImg = async (email, imgfile) => {
    try {
      const res = await firebase.storage().ref("users/" + `${email}-profile.jpg`).put(imgfile);
      console.log('uploaded successfuly');
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserFromStore = async (user) => {
    const res  = await usersRef.where("email",'==',user.email).get();
    return res
  }

  const getUserProfileImg = async (user) => {
      try {
          const imgUrl = await firebase.storage().ref("users/" + `${user.email}-profile.jpg`).getDownloadURL();
          return imgUrl
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

  const value = {
    signupUserOnStore,
    getUserProfileImg,
    addUserProfileImg,
    getMessages,
    getUserFromStore
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}
