import { useState, useEffect,useRef } from "react";
import { db } from "../../../firebase";
import { doc, getDocs,onSnapshot, query, collection, where,addDoc,orderBy,serverTimestamp,updateDoc,increment } from "firebase/firestore";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiMessageSquare,FiSend } from "react-icons/fi";
import { BsBookmark,BsBookmarkFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import PersionPage from "./../person";
import {BiChevronLeftCircle,BiChevronRightCircle} from "react-icons/bi"

function ShowAllcomment({like,likeCount,setLikeCount,firstLikeUserName,memberData,post,memberId,dataId,setClickMark,clickMark,showAllcomment,setclickShowAllComment,handleDisLike,handleLike,handleMark,setLike}) {
    //icon style
    const style= {padding:'10px',width:"25px",height:"25px"};
    const likestyle= {padding:'10px',width:"25px",height:"25px",color:"#e42c64"};


    //state
    const [showLike,setShowLike]=useState(false);
    const [userIsLikeData,setUserIsLikeData]=useState([])

    //發文者
    const [posterImg,setPosterImg]=useState("")
    ///留言相關
    const [commentnum,setCommentnum]=useState("")
    const [allComment,setAllComment]=useState([])

    //貼文作者與使用者同一個uid
    const [theSameUID,setTheSameUID]=useState(false)
    //點擊x顯示刪除貼文提示
    const [clickDelete,setClickDelete]=useState(false)
    //計算圖片輪播
    const [totalimgCount, setToalImgCount] = useState(0);
    const [currentImgCount, setCurrentImgCount] = useState(0);
    const [splitComment,setSplitComment]=useState([])
    const imageRef=useRef(null)

    //composition事件
    const composingRef = useRef(false);
    const [composingValue, setComposingValue] = useState('');


    console.log("showComment",memberData.userId)

    //貼文資料按讚資料
    useEffect(()=>{

        const renderFirst=async()=>{
        //計算使用者按讚人數
            const postAllLike=post.like
            const count =postAllLike.length
            setLikeCount(count) //紀錄按讚人數
            //找出使用者是否有在按讚紀錄內
            for (let i of postAllLike){
                if (i==memberData.userId){
                    //若有在按讚紀錄內設愛心為true
                    setLike(true)
                }
            }

            //全部貼文留言資料
            const commentList=[]
            const subColRef = query(collection(db, "posts", dataId, "comment"),orderBy("timestamp","desc"));
            const unsub =onSnapshot(subColRef,async (querySnapshot)=>{
                const data = querySnapshot.docs.map(doc=>{
                    return doc.data();
                })
                console.log("data",data)
                //搜尋comment留言者頭像
                for (let i of data){
                    const q = query(collection(db, "user"), where("userId", "==", i.uid));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                      // doc.data() is never undefined for query doc snapshots
                      i.userImg=doc.data().personImg
                    });
                }


                setAllComment(data);
                setCommentnum(data.length)
            })

            
            //獲取發文者頭像圖片
            const q = query(collection(db, "user"), where("username", "==", post.username));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                if(querySnapshot){
                    querySnapshot.forEach((doc) => {
                        const postData=doc.data().personImg
                        setPosterImg(postData)
                });
                }
            });
            for (let i=0;i<memberData.collect.length;i++){
                if (memberData.collect[i]===dataId){
                    setClickMark(true)
                }
            }
            //獲取發文內照片
            const postImage=post.images
            setToalImgCount(postImage.length)
            setCommentnum(0)

        }

        renderFirst();

    },[memberData,like])




    //將留言寫入資料庫
    const handleSend=async ()=>{
        //寫入集合>文檔>集合comment資料
        const subColRef = await addDoc(collection(db, "posts", dataId, "comment"),
        {
            "uid":memberData.userId,
            "username":memberData.username,
            "message":composingValue,
            "timestamp":serverTimestamp()
        });
        composingRef.current.value="";
        //更新文檔commentCount
        const washingtonRef = doc(db, "posts", dataId);
        await updateDoc(washingtonRef, {
            commentCount:increment(1)
          });
    }

    const handleChange=(e)=>{
        //取得鍵入留言字串
        let { value: newStr } = e.currentTarget;
        // 当中文输入的时候，不触发onChange事件，触发setComposingValue只是为了让输入框同步你输入的text
        if (composingRef.current) {
          setComposingValue(newStr);
        } else {
          // 完成中文输入时同步一次 composingValue
          setComposingValue(newStr);
        }
    }

    //刪除
    function handleDelete(){
        !clickDelete?setClickDelete(true):setClickDelete(false)
        
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
    function goToSlide(index){
        setCurrentImgCount(index);
    }

    

    
    return(
        <>
            <div className="showAllcommentContainer">
                <div className="closeAllcomment" onClick={()=>{setclickShowAllComment(false)}}><CgClose style={{width:"30px",height:"30px",color:"#FFF"}}/></div>
                <div className="showAllcommentContainer__box">
                    <div className="showAllcommentContainer__img">
                        {(totalimgCount==1 ||currentImgCount == 0 )?null : (<div className="showAllcommentContainer__picture__Leftbtn" >
                            <BiChevronLeftCircle style={{width:"30px",height:"30px",color:"rgba(0,0,0,0.7)"}}
                            onClick={clickPreviousPicture}/></div>)}
                        
                        <div className="showAllcommentContainer__main">
                            <div className="showAllcommentContainer__box__Image" ref={imageRef} 
                            style={{backgroundImage:`url(${post.images[currentImgCount]})`}}></div>
                        </div>
                        <div className="showAllcommentContainer__picture__like">
                            {showLike?<FaHeart style={{width:"30%",height:"30%",color:"#e42c64"}}/>:null}
                        </div>
                        {(totalimgCount==1 ||currentImgCount + 1 == totalimgCount) ? null : (<div className="showAllcommentContainer__picture__Rightbtn" >
                            <BiChevronRightCircle style={{width:"30px",height:"30px",color:"rgba(0,0,0,0.7)"}}
                            onClick={clickNextPicture}/></div>)}
                    </div>
                    <div className="showAllcommentContainer__information">

                        <div className="showAllcommentContainer__name">
                            <div className="showAllcommentContainer__name__title">
                                <div className="showAllcommentContainer__name__personImagebox">
                                    <div className="showAllcommentContainer__name__personImage" style={{backgroundImage:`url(${posterImg})`}}></div>
                                    <div className="showAllcommentContainer__name__username">{post.username}</div>
                                </div>
                                <div  className="showAllcommentContainer__deletePost" onClick={handleDelete}>{theSameUID?<CgClose/>:null}</div>
                            </div>
                        </div>

                        <div className="showAllcommentContainer__content__main">
                            {post.caption === ""?null:
                            <div className="showAllcommentContainer__content">
                                <div className="showAllcommentContainer__content__authBox">
                                    <div className="showAllcommentContainer__authImg" style={{backgroundImage:`url(${posterImg})`}}></div>
                                    <div className="showAllcommentContainer__auth">{post.username}</div>
                                </div>
                                <div className="showAllcommentContainer__text">{post.caption}</div>
                            </div>}

                            <div className="showAllcommentContainer__msg__box">
                            {allComment?allComment.map(({userImg,username,message},index)=>{
                                return(
                                    <div className="showAllcommentContainer__msg" key={index}>
                                    <div className="showAllcommentContainer__msg__main">
                                        <div className="showAllcommentContainer__msg__userBox">
                                            <div className="showAllcommentContainer__msg__userImg" style={{backgroundImage:`url(${userImg})`}}></div>
                                            <div className="showAllcommentContainer__msg__name">{username}</div>
                                        </div>
                                        <div className="showAllcommentContainer__msg__msg">{message}</div>
                                    </div>
                                    {/* <div className="container__msg__like"><FaRegHeart/></div> */}
                                    </div>
                                )
                            }):null}
                            </div>
                        </div>
                        <div className="showAllcommentContainer__icon">
                            <div className="showAllcommentContainer__icon__left">
                                    <div className="showAllcommentContainer__icon__like" onClick={like?handleDisLike:handleLike}>
                                        {like?<FaHeart style={likestyle}/>:<FaRegHeart style={style}/>}
                                    </div>
                                    <div className="showAllcommentContainer__icon__msg" onClick={showAllcomment}><FiMessageSquare style={style}/></div>
                                    {/* <div className="caption__icon__sendMsg"><FiSend style={style}/></div> */}
                                </div>
                                <div className="showAllcommentContainer__icon__mark" onClick={handleMark}>
                                    {clickMark?<BsBookmarkFill style={style}/>:<BsBookmark style={style}/>}
                                    
                            </div>
                        </div>
                        <div>
                            {likeCount>1?
                            <div className="showAllcommentContainer__like">
                                <div className="showAllcommentContainer__like_name">{firstLikeUserName}</div>
                                <div className="showAllcommentContainer__like__count">和其他{likeCount-1}人都說讚</div>
                            </div>
                            :null
                            }
                            {likeCount==1?
                            <div className="showAllcommentContainer__like">
                                <div className="showAllcommentContainer__like_name">{firstLikeUserName}說讚</div>
                            </div>:null
                            }
                            {likeCount==0?null:null}
                        </div>
                        <div className="showAllcommentContainer__input">
                                <input className="showAllcommentContainer__msg__input"type="text" placeholder="留言..."
                                ref={composingRef}
                                onChange={handleChange}
                                onKeyPress={(e)=>{if (e.key === "Enter"){handleSend();}}}
                                ></input>
                            </div>


                    </div>
            </div>
            </div>
        </>
        
    )
}

export default ShowAllcomment;


