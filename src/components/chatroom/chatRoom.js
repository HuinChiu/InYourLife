import SideBar from "../navigate/sidebar";
import { useEffect, useState } from "react";
import {
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import FollowingUser from "./followingUser";
import ChatBox from "./chatBox";
import Input from "./input";

function ChatRoom({ memberData }) {
  const { username, following } = memberData;
  const [followingList, setfollowingList] = useState([]);
  const [chatMsg, setChatMsg] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchUserData, setSearchUserData] = useState("");
  const [chats, setChats] = useState([]);
  const [selectUserInfo, setSelectUserInfo] = useState([]);

  // //傳送訊息給對方
  // const sendMessage = async () => {
  //   console.log(chatMsg);
  //   const docRef = await addDoc(collection(db, "messages"), {
  //     uid: memberData.userId,
  //     userImg: memberData.personImg,
  //     message: message,
  //     acceptUid: post.uid,
  //     timestamp: serverTimestamp(),
  //   });
  //   console.log("Document written with ID: ", docRef.id);
  //   showSendMsgBox();
  //   setChatMsg("");
  // };

  //將訊息至state
  const handleSend = (e) => {
    setChatMsg(e.target.value);
  };

  //搜尋想找的關注者
  const handleKeyPress = async (e) => {
    const target = e.target.value;
    setSearchUser(target);
    const q = query(collection(db, "user"), where("username", "==", target));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        setSearchUserData(user);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //找到目前有對話使用者
  useEffect(() => {
    const getChats = () => {
      const unsubscribe = onSnapshot(
        doc(db, "userChats", memberData.userId),
        (doc) => {
          if (doc == "undefined") {
            setChats([]);
          } else {
            setChats(doc.data());
          }
        }
      );

      return () => {
        unsubscribe();
      };
    };
    memberData.userId && getChats();
  }, [memberData.userId]);

  //選擇想要聊天的使用者顯示聊天室
  const handleSelect = (chat) => {
    setSelectUserInfo(chat);
  };
  return (
    <>
      <div className="chatRoom">
        <div className="chatRoom__info">
          <div className="chatRoom__userName">{username}</div>
          <input
            className="chatRoom__search"
            type="text"
            placeholder="請輸入使用者名稱..."
            onChange={handleKeyPress}
            value={searchUser}
          ></input>
          <div className="chatRoom__following">
            {searchUserData ? (
              <FollowingUser
                user={searchUserData}
                setSearchUserData={setSearchUserData}
                setSearchUser={setSearchUser}
                memberData={memberData}
              />
            ) : null}
            {chats
              ? Object.entries(chats)
                  .sort((a, b) => b[1].date - a[1].date)
                  .map((chat) => (
                    <div
                      key={chat[0]}
                      onClick={() => {
                        handleSelect(chat);
                      }}
                    >
                      <FollowingUser
                        user={chat[1]}
                        memberData={memberData}
                        setSearchUserData={setSearchUserData}
                        setSearchUser={setSearchUser}
                      />
                    </div>
                  ))
              : null}
          </div>
        </div>
        <div className="chatRoom__main">
          <ChatBox
            selectUserInfo={selectUserInfo}
            memberData={memberData}
          ></ChatBox>
          <Input selectUserInfo={selectUserInfo} memberData={memberData} />
        </div>
      </div>
    </>
  );
}
export default ChatRoom;
