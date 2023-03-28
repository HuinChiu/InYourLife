import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import SideBar from "../components/navigate/sidebar";
import Main from "../components/homepage/main";
import PersionPage from "./person";
import CreateNewPage from "./action/createNewPage";
import Setting from "./action/setting";
import ChatRoom from "./chatroom/chatRoom";
function HomePage() {
  const navigate = useNavigate();

  const [clickPerson, setClickPerson] = useState(false);
  const [clickCreateNewPage, setCreateNewPage] = useState(false);
  const [clickChat, setClickChat] = useState(false);
  const [clickMain, setClikMain] = useState(true);

  const [memberData, setMemberData] = useState({});
  const [fullName, setFullName] = useState("");
  const [userName, setUsername] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [memberId, setMemberId] = useState("");
  const [personImg, setPersonImg] = useState("");
  const [setting, setSetting] = useState(false);

  //確認是否登入並獲取資料
  async function checkSinIN() {
    //獲取當前會員的uid
    let uidData = "";

    await onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        uidData = uid;
        //撈取資料庫內當前會員資料
        const uidRef = query(
          collection(db, "user"),
          where("userId", "==", uidData)
        );
        onSnapshot(uidRef, (snapshots) => {
          snapshots.docs.forEach((a) => {
            const user = a.data();
            setMemberData(user);
            setUsername(user.username);
            setFullName(user.fullName);
            setFollowers(user.followers.length);
            setFollowing(user.following.length);
            setPersonImg(user.personImg);
            setMemberId(a.id);
          });
        });
      } else {
        navigate("/signin");
      }
    });
  }

  useEffect(() => {
    checkSinIN();
  }, []);

  //確認是否案個人網頁，true跳轉至個人頁面
  function clickPersonHandler() {
    setClickPerson(true);
    setClikMain(false);
    setClickChat(false);
  }
  //確認是否新增貼文，true顯示貼文創建頁面
  function clickCreatNewHandler() {
    !clickCreateNewPage ? setCreateNewPage(true) : setCreateNewPage(false);
  }
  //確認是否返回首頁，true返回首頁
  function clickBackHomePage() {
    setClikMain(true);
    setClickChat(false);
    setClickPerson(false);
    navigate("/");
  }
  //設定
  function clickSetting() {
    !setting ? setSetting(true) : setSetting(false);
  }

  function clickChatRoom() {
    setClickChat(true);
    setClickPerson(false);
    setClikMain(false);
  }

  return (
    <>
      <div className="homeBox">
        <SideBar
          clickPersonHandler={clickPersonHandler}
          clickCreatNewHandler={clickCreatNewHandler}
          clickBackHomePage={clickBackHomePage}
          clickChatRoom={clickChatRoom}
          memberData={memberData}
          personImg={personImg}
        ></SideBar>
        <div className="homeMain">
          {clickMain ? (
            <Main memberData={memberData} memberId={memberId} />
          ) : null}
          {setting && (
            <Setting
              memberData={memberData}
              clickSetting={clickSetting}
              memberId={memberId}
            />
          )}
          {clickPerson ? (
            <PersionPage
              memberData={memberData}
              personImg={personImg}
              setPersonImg={setPersonImg}
              memberId={memberId}
              clickSetting={clickSetting}
            />
          ) : null}
          {clickChat ? <ChatRoom memberData={memberData} /> : null}
        </div>
        {clickCreateNewPage ? (
          <CreateNewPage
            clickCreatNewHandler={clickCreatNewHandler}
            memberData={memberData}
            personImg={personImg}
          />
        ) : null}
      </div>
    </>
  );
}

export { HomePage };
