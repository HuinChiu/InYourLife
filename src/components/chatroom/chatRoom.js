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

  //將訊息至state
  const handleSend = (e) => {
    setChatMsg(e.target.value);
  };
  useEffect(() => {
    document.title = "InYourLife-聊天室";
  });

  //搜尋想找的關注者
  const handleKeyPress = async (e) => {
    const target = e.target.value;
    setSearchUser(target);
    const q = query(collection(db, "user"), where("username", "==", target));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        console.log("setSearchUser", user);
        setSearchUserData(user);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //找到目前有對話使用者
  useEffect(() => {
    const getChats = () => {
      console.log("memberData", memberData.userId);
      const unsubscribe = onSnapshot(
        doc(db, "userChats", memberData.userId),
        (doc) => {
          console.log("doc", doc);
          console.log("doc data", doc.data());
          if (doc == "undefined") {
            setChats([]);
          } else {
            setChats(doc.data());
            console.log("setChats", doc.data());
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
    console.log("chat", chat);
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
            placeholder="請輸入完整使用者名稱..."
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
