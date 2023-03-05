import { useState, useEffect,useRef } from "react";
import { db } from "../../../firebase";
import { doc, onSnapshot, query, collection, where } from "firebase/firestore";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { FiSend } from "react-icons/fi";
import { BsBookmark } from "react-icons/bs";
import { BsBookmarkFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import PersionPage from "../person";

function ShowAllcomment({
  caption,
  memberData,
  like,
  handleDisLike,
  handleLike,
  style,
  likestyle,
  images,
  postLikeCount,
  handleChange,
  dataId,
  setclickShowAllComment,
  handleMark,
  clickMark,
  handleSend,
}) {
    //找到文件資料
    const [postData,setPostData]=useState()
    //設立img總數
    const [currentImgNum,setCurrentImgNum]=useState(0)
    const [totelImgNum,setTotalImgNum]=useState(0)
    const [ImgList,setImgList]=useState([])

    const [addImgComment, setAddImgComment] = useState([]);
    //找到全部的comment
    const [allComment, setAllComment] = useState([]);
    //composition事件
    const composingRef = useRef(false);
    const [value, onChange] = useState('');
    const [composingValue, setComposingValue] = useState('');
    const innerValue = composingRef.current ? composingValue : value ?? '';

  // for (let i of allComment){
  //     console.log(i)
  //     // const q = query(collection(db, "user"), where("userId", "==", i.uid));
  //     // const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     // querySnapshot.forEach((doc) => {
  //     //     //將username更新到新的comment
  //     //     allComment[i].username = doc.data().username
  //     // });
  //     // });
  // }
  useEffect(()=>{
    const unsub = onSnapshot(doc(db, "posts", dataId), (doc) => {
        setPostData(doc.data())
        const ImgList=doc.data().images
        setImgList(ImgList)
        const imgnum=doc.data().images.length
        setTotalImgNum(imgnum) //找到image總數

        const comment = doc.data().comment;
        const allcommentNum = doc.data().comment.length;
        if (comment === {}) {
          setAllComment([]);
        } else {
          setAllComment(comment);
        }
      });
  },[])


  //找到留言者img並顯示
  const findpersonImg = async () => {
    allComment.map((user) => {
      const q = query(collection(db, "user"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const personImgList = [];
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            personImgList.push(doc.data().personImg);
            setAddImgComment((pre) => [...pre, doc.data().personImg]);
          });
        }
      });
    });
  };

  useEffect(() => {
    findpersonImg();
  }, []);

  function closetAllComment() {
    setclickShowAllComment(false);
  }

  return (
    <>
      <div className="showAllcommentContainer">
        <div
          className="showAllcommentContainer__closeBtn"
          onClick={closetAllComment}
        >
          <CgClose style={{ width: "50px", height: "50px" }}></CgClose>
        </div>
        <div className="showAllcommentContainer__box">
          <div
            className="showAllcommentContainer__box__Image"
            style={{ backgroundImage: `url(${ImgList[currentImgNum]})` }}
          ></div>

          <div className="showAllcommentContainer__box__information">
            <div className="showAllcommentContainer__informationgroup">
              <div
                className="showAllcommentContainer__box__information__personImg"
                style={{ backgroundImage: `url(${memberData.personImg})` }}
              ></div>
              <div className="showAllcommentContainer__box__information__title">
                {memberData.username}
              </div>
            </div>
            <div className="showAllcommentContainer__box__caption">
              <div className="caption__member">
                <div
                  className="caption__personIng"
                  style={{ backgroundImage: `url(${memberData.personImg})` }}
                ></div>
                <div className="caption__username">{memberData.username}</div>
              </div>
              <div className="caption__caption">{caption}</div>
              <div className="caption__comment">
                {allComment.map(({ username, message }, index) => {
                  return (
                    <div className="container__msg" key={index}>
                      <div className="container__msg__main">
                        <div className="container__msg__user">
                          <div
                            className="container__msg__personImg"
                            style={{
                              backgroundImage: `url(${addImgComment[index]})`,
                            }}
                          ></div>
                          <div className="container__msg__name">{username}</div>
                        </div>
                        <div className="container__msg__msg">{message}</div>
                      </div>
                      {/* <div className="container__msg__like"><FaRegHeart/></div> */}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="showAllcommentContainer__box__caption__icon">
              <div className="caption__icon__group">
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
                <div className="caption__icon__msg">
                  <FiMessageSquare style={style} />
                </div>
                <div className="caption__icon__sendMsg">
                  {/* <FiSend style={style} /> */}
                </div>
              </div>
              <div>
                <div className="caption__icon__mark" onClick={handleMark}>
                  {clickMark ? (
                    <BsBookmarkFill style={style} />
                  ) : (
                    <BsBookmark style={style} />
                  )}
                </div>
              </div>
            </div>
            <div className="box__caption__like">{postLikeCount}個讚</div>

            <div className="showAllcommentContainer__box__input">
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
        </div>
      </div>
    </>
  );
}

export default ShowAllcomment;
