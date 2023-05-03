import {
  getDoc,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { MdEmojiFoodBeverage } from "react-icons/md";
const FollowingUser = ({
  user,
  memberData,
  setSearchUserData,
  setSearchUser,
}) => {
  console.log("followingUser", user, memberData);
  //選擇對話的用戶，若無聊天過點擊後產生聊天室
  const handleSelect = async () => {
    const combinedId =
      memberData.userId > user.userId
        ? memberData.userId + user.userId
        : user.userId + memberData.userId;
    console.log("combinedId", combinedId);
    //create userchat
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        //create chat in messages collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        //create user chat
        await updateDoc(doc(db, "userChats", memberData.userId), {
          [combinedId + ".userInfo"]: {
            userId: user.userId,
            username: user.username,
            personImg: user.personImg,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        //create user chat
        await updateDoc(doc(db, "userChats", user.userId), {
          [combinedId + ".userInfo"]: {
            userId: memberData.userId,
            username: memberData.username,
            personImg: memberData.personImg,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }
    setSearchUserData(null);
    setSearchUser("");
  };

  return (
    <div className="chatRoom__following__item" onClick={handleSelect}>
      <div
        className="chatRoom__followingImg"
        style={{
          backgroundImage: `url(${
            user.userInfo ? user.userInfo.personImg : user.personImg
          })`,
        }}
      ></div>
      <div className="chatRoom__username">
        <div> {user.userInfo ? user.userInfo.username : user.username}</div>
        <div className="chatRoom__lastMessage">
          {user.lastMessage ? user.lastMessage.text : user.lastMessage}
        </div>
      </div>
    </div>
  );
};

export default FollowingUser;
