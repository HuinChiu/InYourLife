import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../../../firebase";
import { v4 as uuid } from "uuid";

const Input = ({ selectUserInfo, memberData }) => {
  const [text, setText] = useState("");
  const chatId = selectUserInfo[0];
  console.log(selectUserInfo, selectUserInfo[0]);
  const userInfo = selectUserInfo[1];
  console.log(chatId);

  const handleSend = async () => {
    if (text) {
      console.log("textexit!");
      try {
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: memberData.userId,
            date: Timestamp.now(),
          }),
        });
        console.log("update");
        await updateDoc(doc(db, "userChats", memberData.userId), {
          [chatId + ".lastMessage"]: {
            text,
          },
          [chatId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", userInfo.userInfo.userId), {
          [chatId + ".lastMessage"]: {
            text,
          },
          [chatId + ".date"]: serverTimestamp(),
        });
      } catch (error) {
        alert("請點選傳送訊息的使用者！");
      }

      setText("");
    }
  };
  return (
    <input
      className="chatRoom__input"
      type="text"
      placeholder="請輸入訊息..."
      onChange={(e) => {
        setText(e.target.value);
      }}
      value={text}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          handleSend();
        }
      }}
    />
  );
};
export default Input;
