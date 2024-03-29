import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth, storage } from "../../firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  where,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Setting from "./action/setting";
import ShowAllcomment from "./action/showTotalComment";
import { BsGrid3X3 } from "react-icons/bs";
import { BiBookmark } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { AiFillSetting } from "react-icons/ai";

function PersonPage({
  memberData,
  personImg,
  setPersonImg,
  memberId,
  clickSetting,
}) {
  //點擊貼文true點擊收藏false
  const [selectOption, setSelectOption] = useState("post");
  const [selectData, setSelectData] = useState([]);
  const [collectData, setCollectData] = useState([]);
  const [fullCollect, setFullCollect] = useState([]);
  //是否顯示個人頁面？
  const [clickShowAllcomment, setclickShowAllComment] = useState(false);
  //計算個人貼文數
  const [postCount, setPostCount] = useState(0);
  //計算留言總數
  const [allComment, setAllComment] = useState([]);
  const [commentNum, setCommentNum] = useState(0);

  const clickstyle = {
    borderTop: "1px solid black",
  };

  useEffect(() => {
    document.title = "InYourLife-個人頁面";
  });

  //點擊頭像上傳新的照片
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    await uploadImg(file);
  }
  //上傳至storage
  async function uploadImg(file) {
    const storageRef = ref(storage, `/user/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress, "%");
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        //獲取上傳storage的url
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          setPersonImg(url);
          const washingtonRef = doc(db, "user", memberId);
          //更新firestroe會員個人頭像url
          await updateDoc(washingtonRef, {
            personImg: url,
          }).catch((error) => console.log(error));

          //查詢聊天室裡username
          const queryChatroomUsername = query(collection(db, "userChats"));
          const queryChatRoomSnapshot = await getDocs(queryChatroomUsername);
          queryChatRoomSnapshot.forEach(async (document) => {
            const data = document.data();
            let chatId = [];
            for (let i in data) {
              chatId.push(i);
              if (memberData.userId === data[i].userInfo.userId) {
                const washDocRef = doc(db, "userChats", document.id);
                //更新聊天室裡username
                await updateDoc(washDocRef, {
                  [i + ".userInfo.personImg"]: url,
                });
              }
            }
          });
        });
      }
    );
  }

  useEffect(() => {
    //找出自己的發文內容
    if (selectOption === "post") {
      const q = query(
        collection(db, "posts"),
        where("uid", "==", memberData.userId),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setSelectData([]);
        querySnapshot.forEach((doc, index) => {
          //1個文章data
          const data = doc.data();
          console.log("我person外面", data);
          setSelectData((pre) => [...pre, data]);
          // setPostCount(selectData.length);
        });
      });
    }
    setCollectData(memberData.collect);
  }, []);

  const handleSelect = async () => {
    setCollectData([]);
    for (let i of collectData) {
      const docRef = doc(db, "posts", i);
      const docData = onSnapshot(docRef, (doc) => {
        console.log("collectData", doc.data());
        let querydata = doc.data();
        if (querydata === undefined) {
          return false;
        }
        setFullCollect((pre) => [...pre, querydata]);
      });
    }
    setSelectOption("collect");
  };

  const handlePost = () => {
    setSelectOption("post");
  };

  const showContent = () => {
    setclickShowAllComment(true);
  };

  return (
    <>
      <div className="personDocument">
        {clickShowAllcomment ? (
          <ShowAllcomment memberData={memberdata}></ShowAllcomment>
        ) : null}
        <div className="personDocument__img">
          <label htmlFor="uploadPersonimg">
            <input
              id="uploadPersonimg"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
            <div
              className="person__Img"
              style={{
                backgroundImage: `url(${personImg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>
          </label>
        </div>
        <div className="personInfomation">
          <div className="personInfomation__item">
            <div className="personInfomation__id-name">
              {memberData.username}
            </div>
            <div className="personInfomation__edit" onClick={clickSetting}>
              編輯個人檔案
            </div>
            <div className="personInfomation__edit-icon" onClick={clickSetting}>
              <AiFillSetting style={{ width: "20px", height: "20px" }} />
            </div>
          </div>
          <div className="personInfomation__item">
            <div className="personInfomation__item-num">
              <div className="post_num">{selectData.length}</div>貼文
            </div>
            <div className="personInfomation__followers-num">
              <div className="post_num">{memberData.followers.length}</div>粉絲
            </div>
            <div className="personInfomation__following-num">
              <div className="post_num">{memberData.following.length}</div>
              追蹤中
            </div>
          </div>
          <div className="personInfomation__item introduction">
            <div className="personInfomation__name">{memberData.fullName}</div>
            <div className="personInfomation__introduction">
              {memberData.introduction}
            </div>
          </div>
        </div>
      </div>
      <hr className="person__hr"></hr>
      <div className="personInfomation__select">
        <div
          className="personInfomation__select__item"
          value="post"
          style={selectOption == "post" ? clickstyle : null}
          onClick={handlePost}
        >
          <div className="select_icon" id="post">
            <BsGrid3X3 />
          </div>
          <div className="select_title">貼文</div>
        </div>
        <div
          className="personInfomation__select__item"
          value="collect"
          style={selectOption == "collect" ? clickstyle : null}
          onClick={handleSelect}
        >
          <div className="select_icon" id="collect"></div>
          <BiBookmark />
          <div className="select_title">收藏</div>
        </div>
      </div>
      <div className="person_post">
        {selectOption == "post"
          ? selectData.map((data, index) => {
              return (
                <div
                  className="person_post__item"
                  key={index}
                  onClick={showContent}
                >
                  <div
                    className="item__img"
                    style={{ backgroundImage: `url(${data.images[0]})` }}
                  >
                    <div className="item__status">
                      <div className="item__status_heart">
                        <FaHeart></FaHeart>
                        {data.like.length}
                      </div>
                      <div className="item__status_msg">
                        <FiMessageSquare></FiMessageSquare>
                        {data.commentCount}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
        {selectOption == "collect" && fullCollect
          ? fullCollect.map((data, index) => {
              return (
                <div className="person_post__item" key={index}>
                  <div
                    className="item__img"
                    style={{ backgroundImage: `url(${data.images[0]})` }}
                  >
                    <div className="item__status">
                      <div className="item__status_heart">
                        <FaHeart></FaHeart>
                        {data.like.length}
                      </div>
                      <div className="item__status_msg">
                        <FiMessageSquare></FiMessageSquare>
                        {data.commentCount}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </>
  );
}

export default PersonPage;
