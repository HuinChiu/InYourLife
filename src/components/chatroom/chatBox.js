import { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import Message from "./Message";

const ChatBox = ({ selectUserInfo, memberData }) => {
  const [messages, setMessages] = useState([]);
  const chatId = selectUserInfo[0];
  const userInfo = selectUserInfo[1];

  useEffect(() => {
    if (chatId) {
      onSnapshot(doc(db, "chats", chatId), (doc) => {
        console.log("chatsId onSnapshot", doc.data());
        const message = doc.data().messages;
        setMessages(message);
      });
    }
  }, [chatId]);

  console.log("messages", messages);
  // useEffect(() => {
  //   const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
  //     doc.exists() && setMessages(doc.data());
  //   });

  //   return () => {
  //     unsub();
  //   };
  // }, [chatId]);

  // console.log(memberData);
  // const [chats, setChats] = useState([]);

  // useEffect(() => {
  //   const getChats = () => {
  //     const unsubscribe = onSnapshot(
  //       doc(db, "userChats", memberData.userId),
  //       (doc) => {
  //         console.log("userChats", doc);
  //         setChats(doc.data());
  //       }
  //     );

  //     return () => {
  //       unsubscribe();
  //     };
  //   };
  //   memberData.userId && getChats();
  // }, [memberData.userId]);

  // console.log(Object.entries(chats));
  return (
    <div className="chatRoom__box">
      <div className="chatRoom__box__username">
        {userInfo ? userInfo.userInfo.username : null}
      </div>
      <div className="chatRoom__msg__box">
        {messages
          ? messages.map((msg) => (
              <Message
                key={msg.id}
                msg={msg}
                memberData={memberData}
                userInfo={userInfo}
              ></Message>
            ))
          : null}
      </div>
    </div>
  );
};

export default ChatBox;
