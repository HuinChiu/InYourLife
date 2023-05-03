import { useState, useEffect, useRef } from "react";
import {
  doc,
  addDoc,
  where,
  collection,
  updateDoc,
  query,
  getDocs,
  arrayRemove,
  arrayUnion,
  onSnapshot,
  increment,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import DeleteAlert from "../action/deleteAlert";
import ShowAllcomment from "../action/showTotalComment";
import SendMsg from "../action/sendMessage";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { FiSend } from "react-icons/fi";
import { BsBookmark } from "react-icons/bs";
import { BsBookmarkFill } from "react-icons/bs";
import { BiChevronLeftCircle } from "react-icons/bi";
import { BiChevronRightCircle } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { AiOutlineConsoleSql } from "react-icons/ai";

function Container({ post, memberId, dataId, memberData }) {
  //icon style
  const style = { padding: "10px", width: "25px", height: "25px" };
  const likestyle = {
    padding: "10px",
    width: "25px",
    height: "25px",
    color: "#e42c64",
  };

  //state
  const [like, setLike] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [userIsLikeData, setUserIsLikeData] = useState([]);

  //發文者
  const [posterImg, setPosterImg] = useState("");
  ///留言相關
  const [commentnum, setCommentnum] = useState("");
  const [allComment, setAllComment] = useState([]);
  const [splitComment, setSplitComment] = useState([]);
  const [clickShowAllcomment, setclickShowAllComment] = useState(false);
  //按讚相關
  const [likeCount, setLikeCount] = useState(0);
  const [firstLikeUserID, setFirstLikeUserID] = useState("");
  const [firstLikeUserName, setFirstLikeUserName] = useState("");
  //收藏相關
  const [clickMark, setClickMark] = useState(false);
  //貼文作者與使用者同一個uid
  const [theSameUID, setTheSameUID] = useState(false);
  //點擊x顯示刪除貼文提示
  const [clickDelete, setClickDelete] = useState(false);
  //計算圖片輪播
  const [totalimgCount, setToalImgCount] = useState(0);
  const [currentImgCount, setCurrentImgCount] = useState(0);
  const imageRef = useRef(null);
  //有無關注
  const [following, setFollowing] = useState(false);
  const followTrueRef = useRef(null);
  const followFalseRef = useRef(null);
  //傳送訊息
  const [showSendMsg, setShowSendMsg] = useState(false);
  //composition事件
  const composingRef = useRef(false);
  const [composingValue, setComposingValue] = useState("");
  //loading
  const [loading, setLoading] = useState(false);

  //設定網頁標題
  useEffect(() => {
    document.title = "InYourLife-首頁";
  }, []);

  const renderFirst = async () => {
    post.uid === memberData.userId ? setTheSameUID(true) : setTheSameUID(false);
    //計算使用者按讚人數
    const postAllLike = post.like;
    const count = postAllLike.length;
    if (count > 0) {
      const first = postAllLike[0];
      setFirstLikeUserID(first); //找出第一個按讚人名字
      const q = query(collection(db, "user"), where("userId", "==", first));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const result = doc.data().username;
        setFirstLikeUserName(result);
      });
    }
    setLikeCount(count); //紀錄按讚人數
    setUserIsLikeData(postAllLike); //紀錄所有按讚使用者uid
    //找出使用者是否有在按讚紀錄內
    for (let i of postAllLike) {
      if (i === memberData.userId) {
        //若有在按讚紀錄內設愛心為true
        setLike(true);
      }
    }

    //找出使用者有無追蹤發布者
    const following = memberData.following;
    if (following) {
      if (following.includes(post.uid)) {
        setFollowing(true);
      }
    }

    //獲取發文者頭像圖片
    const q = query(
      collection(db, "user"),
      where("username", "==", post.username)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const postData = doc.data().personImg;
      setPosterImg(postData);
    });
    //獲取發文內照片
    const postImage = post.images;
    console.log("postImage.length", postImage.length);
    setToalImgCount(postImage.length);

    //確認使用者是否有追蹤貼文
    const userFollow = memberData.following;
    if (userFollow) {
      if (userFollow.includes(post.uid)) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }
    if (memberData) {
      console.log("memberData, useEffect", memberData.collect);
      if (memberData.collect) {
        if (memberData.collect.length !== 0) {
          for (let i = 0; i < memberData.collect.length; i++) {
            if (memberData.collect[i] === dataId) {
              setClickMark(true);
            }
          }
        }
      }
    }
    // };

    //獲取集合>文檔>集合comment資料
    const commentList = [];
    const subColRef = query(
      collection(db, "posts", dataId, "comment"),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(subColRef, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        return doc.data();
      });
      setAllComment(data);
      console.log("data", data.length);
      setCommentnum(data.length);
      setSplitComment(data.slice(-2));
    });
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    //確認使用者與發文者是否同一人
    // post.uid === memberData.userId ? setTheSameUID(true) : setTheSameUID(false);
    // const renderFirst = async () => {
    //   //計算使用者按讚人數
    //   const postAllLike = post.like;
    //   const count = postAllLike.length;
    //   if (count > 0) {
    //     const first = postAllLike[0];
    //     setFirstLikeUserID(first); //找出第一個按讚人名字
    //     const q = query(collection(db, "user"), where("userId", "==", first));
    //     const querySnapshot = await getDocs(q);
    //     querySnapshot.forEach((doc) => {
    //       const result = doc.data().username;
    //       setFirstLikeUserName(result);
    //     });
    //   }
    //   setLikeCount(count); //紀錄按讚人數
    //   setUserIsLikeData(postAllLike); //紀錄所有按讚使用者uid
    //   //找出使用者是否有在按讚紀錄內
    //   for (let i of postAllLike) {
    //     if (i === memberData.userId) {
    //       //若有在按讚紀錄內設愛心為true
    //       setLike(true);
    //     }
    //   }

    //   //找出使用者有無追蹤發布者
    //   const following = memberData.following;
    //   if (following) {
    //     if (following.includes(post.uid)) {
    //       setFollowing(true);
    //     }
    //   }

    //   //獲取發文者頭像圖片
    //   const q = query(
    //     collection(db, "user"),
    //     where("username", "==", post.username)
    //   );
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     const postData = doc.data().personImg;
    //     setPosterImg(postData);
    //   });
    //   //獲取發文內照片
    //   const postImage = post.images;
    //   console.log("postImage.length", postImage.length);
    //   setToalImgCount(postImage.length);

    //   //確認使用者是否有追蹤貼文
    //   const userFollow = memberData.following;
    //   if (userFollow) {
    //     if (userFollow.includes(post.uid)) {
    //       setFollowing(true);
    //     } else {
    //       setFollowing(false);
    //     }
    //   }
    //   if (memberData) {
    //     console.log("memberData, useEffect", memberData.collect);
    //     if (memberData.collect) {
    //       if (memberData.collect.length !== 0) {
    //         for (let i = 0; i < memberData.collect.length; i++) {
    //           if (memberData.collect[i] === dataId) {
    //             setClickMark(true);
    //           }
    //         }
    //       }
    //     }
    //   }
    //   // };

    //   //獲取集合>文檔>集合comment資料
    //   const commentList = [];
    //   const subColRef = query(
    //     collection(db, "posts", dataId, "comment"),
    //     orderBy("timestamp", "desc")
    //   );
    //   const unsub = onSnapshot(subColRef, (querySnapshot) => {
    //     const data = querySnapshot.docs.map((doc) => {
    //       return doc.data();
    //     });
    //     setAllComment(data);
    //     console.log("data", data.length);
    //     setCommentnum(data.length);
    //     setSplitComment(data.slice(-2));
    //   });
    //   setLoading(false);
    // };
    renderFirst();
  }, []);

  useEffect(() => {
    renderFirst();
  }, [like, loading, memberData]);

  // 如果是like:false點擊改為true
  const handleLike = async () => {
    //變更資料庫like資料
    const washingtonRef = doc(db, "posts", dataId);
    //新增userlike:true資料
    await updateDoc(washingtonRef, {
      like: arrayUnion(memberData.userId),
    });
    //設定為true
    setLike(true);
    //顯示大愛心1秒後消失
    setShowLike(true);
    setTimeout(function () {
      setShowLike(false);
    }, 1000);
  };

  //如果是like:true點擊改為false
  const handleDisLike = async () => {
    const washingtonRef = doc(db, "posts", dataId);
    await updateDoc(washingtonRef, {
      like: arrayRemove(memberData.userId),
    });
    setLike(false);
  };

  //將留言寫入資料庫
  const handleSend = async () => {
    //寫入集合>文檔>集合comment資料
    const subColRef = await addDoc(collection(db, "posts", dataId, "comment"), {
      uid: memberData.userId,
      username: memberData.username,
      message: composingValue,
      timestamp: serverTimestamp(),
    });
    composingRef.current.value = "";
    //更新文檔commentCount
    const washingtonRef = doc(db, "posts", dataId);
    await updateDoc(washingtonRef, {
      commentCount: increment(1),
    });
  };

  const handleChange = (e) => {
    //取得鍵入留言字串
    let { value: newStr } = e.currentTarget;
    // 当中文输入的时候，不触发onChange事件，触发setComposingValue只是为了让输入框同步你输入的text
    if (composingRef.current) {
      setComposingValue(newStr);
    } else {
      // 完成中文输入时同步一次 composingValue
      setComposingValue(newStr);
    }
  };

  //點擊看更多留言
  const showAllcomment = () => {
    !clickShowAllcomment
      ? setclickShowAllComment(true)
      : setclickShowAllComment(false);
  };

  //收藏
  const handleMark = async () => {
    if (clickMark === false) {
      const washingtonRef = doc(db, "user", memberId);
      // Atomically add a new region to the "regions" array field.
      await updateDoc(washingtonRef, {
        collect: arrayUnion(dataId),
      });
      setClickMark(true);
    } else {
      const washingtonRef = doc(db, "user", memberId);
      // Atomically add a new region to the "regions" array field.
      await updateDoc(washingtonRef, {
        collect: arrayRemove(dataId),
      });
      setClickMark(false);
    }
  };
  //刪除
  function handleDelete() {
    !clickDelete ? setClickDelete(true) : setClickDelete(false);
  }
  //切換照片
  function clickNextPicture() {
    //進入下一張圖片
    imageRef.current.style.backgroundImage = `url(${
      post.images[currentImgCount + 1]
    })`;
    setCurrentImgCount((pre) => pre + 1);
  }
  function clickPreviousPicture() {
    //返回上一張圖片
    imageRef.current.style.backgroundImage = `url(${
      post.images[currentImgCount - 1]
    })`;
    setCurrentImgCount((pre) => pre - 1);
  }
  function goToSlide(index) {
    setCurrentImgCount(index);
  }

  //點擊關注
  async function clickFollow() {
    //將貼文作者uid加到自己追蹤名單裡
    const washingtonRef = doc(db, "user", memberId);
    await updateDoc(washingtonRef, {
      following: arrayUnion(post.uid),
    });
    //查找貼文作者userId
    const q = query(collection(db, "user"), where("userId", "==", post.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((data) => {
      const washingtonRef = doc(db, "user", data.id);
      updateDoc(washingtonRef, {
        followers: arrayUnion(memberData.userId),
      });
      setFollowing(true);
    });
  }

  //取消關注
  async function clickCancelFollow() {
    //自己追蹤名單裡移除作者uid
    const washingtonRef = doc(db, "user", memberId);
    await updateDoc(washingtonRef, {
      following: arrayRemove(post.uid),
    });
    //作者關注者中移除使用者uid
    const q = query(collection(db, "user"), where("userId", "==", post.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((data) => {
      const washingtonRef = doc(db, "user", data.id);
      updateDoc(washingtonRef, {
        followers: arrayRemove(memberData.userId),
      });
    });
    setFollowing(false);
  }
  //顯示傳送訊息視窗
  function showSendMsgBox() {
    !showSendMsg ? setShowSendMsg(true) : setShowSendMsg(false);
  }

  return (
    <>
      <div className="container">
        {loading ? (
          <div className="container__loading">
            <div className="loadingio-spinner-spin-sub1ib266w">
              <div className="ldio-x2f8f9g0nn">
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
          </div>
        ) : null}
        {clickShowAllcomment ? (
          <ShowAllcomment
            like={like}
            likeCount={likeCount}
            setLikeCount={setLikeCount}
            firstLikeUserName={firstLikeUserName}
            setLike={setLike}
            post={post}
            memberId={memberId}
            dataId={dataId}
            clickMark={clickMark}
            setClickMark={setClickMark}
            memberData={memberData}
            handleLike={handleLike}
            handleDisLike={handleDisLike}
            handleSend={handleSend}
            handleChange={handleChange}
            handleMark={handleMark}
            showAllcomment={showAllcomment}
            setclickShowAllComment={setclickShowAllComment}
          />
        ) : null}
        {clickDelete ? (
          <DeleteAlert
            handleDelete={handleDelete}
            dataId={dataId}
            memberId={memberId}
          ></DeleteAlert>
        ) : null}
        {/* {showSendMsg ? (
          <SendMsg
            memberId={memberId}
            showSendMsgBox={showSendMsgBox}
            memberData={memberData}
            post={post}
          />
        ) : null} */}
        <div className="container__name">
          <div className="container__name__title">
            <div className="container__name__personImagebox">
              <img
                className="container__name__personImage"
                src={posterImg}
              ></img>
              <div className="container__name__username">{post.username}</div>
              {theSameUID || following ? null : (
                <div
                  ref={followFalseRef}
                  className="container__follow"
                  onClick={clickFollow}
                >
                  追蹤
                </div>
              )}
              {following ? (
                <div
                  ref={followTrueRef}
                  onClick={clickCancelFollow}
                  className="container__follow__true"
                >
                  追蹤中
                </div>
              ) : null}
            </div>

            <div className="container__deletePost" onClick={handleDelete}>
              {theSameUID ? <CgClose /> : null}
            </div>
          </div>
        </div>
        <div className="container__picture">
          {totalimgCount === 1 || currentImgCount === 0 ? null : (
            <div className="picture__Leftbtn">
              <BiChevronLeftCircle
                style={{
                  width: "30px",
                  height: "30px",
                  color: "rgba(0,0,0,0.7)",
                }}
                onClick={clickPreviousPicture}
              />
            </div>
          )}

          <div className="picture__main">
            <div
              className="post__main__picture"
              ref={imageRef}
              style={{
                backgroundImage: `url(${post.images[currentImgCount]})`,
              }}
            ></div>
          </div>
          <div className="picture__like">
            {showLike ? (
              <FaHeart
                style={{ width: "30%", height: "30%", color: "#e42c64" }}
              />
            ) : null}
          </div>
          {currentImgCount == totalimgCount - 1 ? null : (
            <div className="picture__Rightbtn">
              <BiChevronRightCircle
                style={{
                  width: "30px",
                  height: "30px",
                  color: "rgba(0,0,0,0.7)",
                }}
                onClick={clickNextPicture}
              />
            </div>
          )}
          <div className="picture__dot">
            {totalimgCount == 1
              ? null
              : post.images.map((data, index) => {
                  return (
                    <div
                      className={`dot dot${index}`}
                      key={index}
                      onClick={() => {
                        goToSlide(index);
                      }}
                    ></div>
                  );
                })}
          </div>
        </div>
        <div className="container__icon">
          <div className="container__icon__left">
            <div
              className="caption__icon__like"
              onClick={like ? handleDisLike : handleLike}
            >
              {like ? (
                <FaHeart style={likestyle} />
              ) : (
                <FaRegHeart style={style} />
              )}
            </div>
            <div className="caption__icon__msg" onClick={showAllcomment}>
              <FiMessageSquare style={style} />
            </div>
            {/* <div className="caption__icon__sendMsg" onClick={showSendMsgBox}>
              <FiSend style={style} />
            </div> */}
          </div>
          <div className="caption__icon__mark" onClick={handleMark}>
            {clickMark ? (
              <BsBookmarkFill style={style} />
            ) : (
              <BsBookmark style={style} />
            )}
          </div>
        </div>
        <div className="container__main">
          {likeCount > 1 ? (
            <div className="container__like">
              <div className="like_name">{firstLikeUserName}</div>
              <div className="like__count">和其他{likeCount - 1}人都說讚</div>
            </div>
          ) : null}
          {likeCount == 1 ? (
            <div className="container__like">
              <div className="like_name">{firstLikeUserName}說讚</div>
            </div>
          ) : null}
          {likeCount == 0 ? null : null}
          <div className="container__content">
            <div className="container__auth">{post.username}</div>
            <div className="container__text">{post.caption}</div>
          </div>
          {commentnum > 3
            ? splitComment.map(({ username, message }, index) => {
                return (
                  <div className="container__msg" key={index}>
                    <div className="container__msg__main">
                      <div className="container__msg__name">{username}</div>
                      <div className="container__msg__msg">{message}</div>
                    </div>
                    {/* <div className="container__msg__like"><FaRegHeart/></div> */}
                  </div>
                );
              })
            : allComment.map(({ username, message }, index) => {
                return (
                  <div className="container__msg" key={index}>
                    <div className="container__msg__main">
                      <div className="container__msg__name">{username}</div>
                      <div className="container__msg__msg">{message}</div>
                    </div>
                    {/* <div className="container__msg__like"><FaRegHeart/></div> */}
                  </div>
                );
              })}
          {commentnum < 3 ? null : (
            <div className="container__seeMore" onClick={showAllcomment}>
              查看全部{commentnum}則留言
            </div>
          )}
          <div className="container__msg__input">
            <input
              className="msg__input"
              type="text"
              placeholder="留言..."
              ref={composingRef}
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            ></input>
          </div>
        </div>
        <hr className="container__hr"></hr>
      </div>
    </>
  );
}

export default Container;
