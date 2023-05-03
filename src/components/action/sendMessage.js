import { db } from "../../../firebase";
import {
  query,
  where,
  onSnapshot,
  collection,
  getDoc,
  doc,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { CgClose } from "react-icons/cg";
import { useEffect, useState } from "react";

function SendMsg({ memberId, showSendMsgBox, memberData, post }) {
  console.log("post", post);
  //建議傳送人物state
  const [suggestMember, setSuggetMember] = useState([]);
  //loding
  const [loding, setLoding] = useState(false);
  //確定傳送人物姓名
  const [sendPerson, setSendPerson] = useState("");
  const [message, setMessage] = useState("");
  //查找建議傳送訊息人物
  useEffect(() => {
    const getUserFollower = async () => {
      setLoding(true);
      const docRef = doc(db, "user", memberId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        for (let i of docSnap.data().following) {
          const q = query(collection(db, "user"), where("userId", "==", i));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setSuggetMember((pre) => [
              ...pre,
              {
                personImg: doc.data().personImg,
                username: doc.data().username,
              },
            ]);
          });
        }
      }
      setLoding(false);
    };

    getUserFollower();
  }, []);
  //將選取到的名字放在致input上面
  const handleCLick = (e) => {
    setSendPerson(e.target.getAttribute("value"));
  };
  //傳送訊息給對方
  const sendMessage = async () => {
    const docRef = await addDoc(collection(db, "messages"), {
      uid: memberData.userId,
      message: message,
      acceptUid: post.uid,
      timestamp: serverTimestamp(),
    });
    showSendMsgBox();
  };

  return (
    <>
      <div className="sendMsgBox">
        <div className="sendMsgBox__container__close" onClick={showSendMsgBox}>
          <CgClose style={{ width: "30px", height: "30px" }}></CgClose>
        </div>
        <div className="sendMsgBox__container">
          <div className="sendMsgBox__container__title">傳送訊息</div>
          <div className="sendMsgBox__container__search">
            致：
            <input
              className="sendMsgBox__container__input"
              type="text"
              placeholder="請點選下面使用者..."
              defaultValue={sendPerson}
            ></input>
          </div>
          <div className="sendMsgBox__container__searchBox">
            <div className="sendMsgBox__searchBox__recomend">
              <div>
                <div className="searchBox__recomend__title">建議</div>
                {loding ? (
                  <div className="loadingio-spinner-spin-n52qtr6h19b">
                    <div className="ldio-qbt6147e1us">
                      <div>
                        <div></div>
                      </div>
                      <div>
                        <div></div>
                      </div>
                      <div>
                        <div></div>
                      </div>
                      <div>
                        <div></div>
                      </div>
                      <div>
                        <div></div>
                      </div>
                      <div>
                        <div></div>
                      </div>
                      <div>
                        <div></div>
                      </div>
                      <div>
                        <div></div>
                      </div>
                      <div>
                        <div></div>
                      </div>
                      <div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {suggestMember.map(({ personImg, username }, index) => {
                  return (
                    <div
                      className="searchBox__recomend__user"
                      key={index}
                      value={username}
                      onClick={handleCLick}
                    >
                      <div
                        className="searchBox__recomend__userImg"
                        style={{ backgroundImage: `url(${personImg})` }}
                      ></div>
                      <div className="searchBox__recomend__username">
                        {username}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="sendMsgBox__searchBox__inputMsg">
              <textarea
                className="searchBox__inputMsg"
                placeholder="請輸入想傳送訊息..."
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              ></textarea>
            </div>
          </div>
          <div className="sendMsgBox__container__sendBtn" onClick={sendMessage}>
            傳送
          </div>
        </div>
      </div>
    </>
  );
}

export default SendMsg;
