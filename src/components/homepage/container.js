import { useState,useEffect } from "react";
import {update,doc,getDoc,where,collection,updateDoc,query,arrayUnion,arrayRemove,onSnapshot,deleteDoc} from "firebase/firestore"
import { db } from "../../../firebase";
import DeleteAlert from "../deleteAlert"
import ShowAllcomment from "./showTotalComment";
import {BiDotsHorizontalRounded} from "react-icons/bi"
import {FaRegHeart,FaHeart} from "react-icons/fa"
import {FiMessageSquare} from "react-icons/fi"
import{FiSend} from "react-icons/fi"
import {BsBookmark} from "react-icons/bs"
import {BsBookmarkFill} from "react-icons/bs"
import{BiChevronLeftCircle} from "react-icons/bi"
import{BiChevronRightCircle} from "react-icons/bi"
import {CgClose} from "react-icons/cg"


function Container({post,memberId,dataId,memberData,personImg}){
    //icon style
    const style= {padding:'10px',width:"25px",height:"25px"};
    const likestyle= {padding:'10px',width:"25px",height:"25px",color:"#e42c64"};


    //state
    const [like,setLike]=useState(false);
    const [showLike,setShowLike]=useState(false);
    const [inputComment,setInputComment]=useState("")
    const [userIsLikeData,setUserIsLikeData]=useState([])

    //發文者
    const [posterImg,setPosterImg]=useState("")
    ///留言相關
    const [commentnum,setCommentnum]=useState("")
    const [clickShowAllcomment,setclickShowAllComment]=useState(false)
    //按讚相關
    const [likeCount,setLikeCount]=useState(0)
    const [firstLikeUserID,setFirstLikeUserID]=useState("")
    const [firstLikeUserName,setFirstLikeUserName]=useState("")
    //收藏相關
    const [clickMark,setClickMark]=useState(false)
    //貼文作者與使用者同一個uid
    const [theSameUID,setTheSameUID]=useState(false)
    //點擊x顯示刪除貼文提示
    const [clickDelete,setClickDelete]=useState(false)

    //貼文資料按讚資料
    useEffect(()=>{
        //確認使用者與發文者是否同一人
        post.uid == memberData.userId?setTheSameUID(true):setTheSameUID(false)

        const renderFirst=async()=>{
        //計算使用者按讚人數
            const postAllLike=post.like
            const count =postAllLike.length
            if (count >0){
                const first=postAllLike[0]
                setFirstLikeUserID(first)
                const q = query(collection(db, "user"), where("userId", "==", first));
                const unsubscribe =onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                const result=doc.data().username
                setFirstLikeUserName(result)
                });
                });
            }
            setLikeCount(count) //紀錄按讚人數
            setUserIsLikeData(postAllLike) //紀錄所有按讚使用者uid
            //找出使用者是否有在按讚紀錄內
            for (let i of postAllLike){
                if (i==memberData.userId){
                    //若有在按讚紀錄內設愛心為true
                    setLike(true)
                }
            }

            //全部貼文留言資料
            const postAllcomment=post.comment
            console.log("postAllcomment",postAllcomment)
            //找出留言總數量
            const allCommentNum=postAllcomment.length
            if (allCommentNum==undefined){
                setCommentnum(0)
            }else{
                setCommentnum(allCommentNum)
            }
            
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


        }

        renderFirst();

    },[like])

    // 如果是like:false點擊改為true
    const handleLike=async ()=>{
        //變更資料庫like資料
        const washingtonRef=doc(db,"posts",dataId);
        //新增userlike:true資料
        await updateDoc(washingtonRef,{
            like:arrayUnion(
                memberData.userId,
        )})
        //設定為true
        setLike(true)
        //顯示大愛心1秒後消失
        setShowLike(true)
        setTimeout(function() {
            setShowLike(false)
        }, 1000)
    }

    //如果是like:true點擊改為false
    const handleDisLike=async ()=>{
        const washingtonRef=doc(db,"posts",dataId);
        await updateDoc(washingtonRef,{
            like:arrayRemove(
                memberData.userId,
            )
        })
        setLike(false)
    }



    const handleKeyDown=async (e)=>{
        e.stopPropagation()
        if(e.key === "Enter"){
            const washingtonRef=doc(db,"posts",dataId);
            await updateDoc(washingtonRef,{
                comment:arrayUnion(
                {
                    uid:memberData.userId,
                    username:memberData.username,
                    message:inputComment,
                })}
                )
        }
    }

    const handlingComposition=()=>{
        isCompositionEnd = false;
    }
    const handleComposition=(e)=>{
        isCompositionEnd = true;
    }
    const handleChange=(e)=>{
        //取得鍵入留言字串
        setInputComment(e.target.value)
    }

    //點擊看更多留言
    const showAllcomment=()=>{
        !clickShowAllcomment?setclickShowAllComment(true):setclickShowAllComment(false)
    }

    //收藏
    const handleMark=async ()=>{
        if(clickMark ===false){
            const washingtonRef = doc(db, "user", memberId);
            // Atomically add a new region to the "regions" array field.
            await updateDoc(washingtonRef, {
                collect: arrayUnion(dataId)
            });
            setClickMark(true)
        }
        else{
            const washingtonRef = doc(db, "user", memberId);
            // Atomically add a new region to the "regions" array field.
            await updateDoc(washingtonRef, {
                collect: arrayRemove(dataId)
            });
            setClickMark(false)
        }
        
    }
    function handleDelete(){
        !clickDelete?setClickDelete(true):setClickDelete(false)
    }
    

    
    return(
        <>
            <div className="container">
            { clickShowAllcomment?<ShowAllcomment
                like={like}
                handleDisLike={handleDisLike}
                handleLike={handleLike}
                handleKeyDown={handleKeyDown}
                likestyle={likestyle}
                style={style}
                images={post.images}
                memberData={memberData}
                caption={post.caption}
                postLikeCount={likeCount}
                comment={post.comment}
                setclickShowAllComment={setclickShowAllComment}
                handleMark={handleMark}
                clickMark={clickMark}
                setClickMark={setClickMark}
            />:null}
            { clickDelete?<DeleteAlert
            handleDelete={handleDelete}
            dataId={dataId}
            ></DeleteAlert>:null
            }
                <div className="container__name">
                    <div className="container__name__title">
                        <div className="container__name__personImagebox">
                            <img className="container__name__personImage" src={posterImg}></img>
                            <div className="container__name__username">{post.username}</div>
                        </div>

                        <div  className="container__deletePost" onClick={handleDelete}>{theSameUID?<CgClose/>:null}</div>
                    </div>
                </div>
            <div className="container__picture">
                <div className="picture__Leftbtn"><BiChevronLeftCircle></BiChevronLeftCircle></div>
                
                <div className="picture__main">
                    <img className="post__main__picture"src={post.images}></img>
                </div>
                <div className="picture__like">
                    {showLike?<FaHeart style={{width:"30%",height:"30%",color:"#e42c64"}}/>:null}
                </div>
                <div className="picture__Rightbtn"><BiChevronRightCircle></BiChevronRightCircle></div>
                <div className="picture__dot">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>
            <div className="container__icon">
                <div className="container__icon__left">
                    <div className="caption__icon__like" onClick={like?handleDisLike:handleLike}>
                        {like?<FaHeart style={likestyle}/>:<FaRegHeart style={style}/>}
                    </div>
                    <div className="caption__icon__msg" onClick={showAllcomment}><FiMessageSquare style={style}/></div>
                    <div className="caption__icon__sendMsg"><FiSend style={style}/></div>
                </div>
                <div className="caption__icon__mark" onClick={handleMark}>
                    {clickMark?<BsBookmarkFill style={style}/>:<BsBookmark style={style}/>}
                    
                </div>
            </div>
            <div className="container__main">
                {likeCount>1?
                <div className="container__like">
                    <div className="like_name">{firstLikeUserName}</div>
                    <div className="like__count">和其他{likeCount-1}人都說讚</div>
                </div>
                :null
                }
                {likeCount==1?
                <div className="container__like">
                    <div className="like_name">{firstLikeUserName}說讚</div>
                </div>:null

                }
                {likeCount==0?
                    null:null
                }
                <div className="container__content">
                    <div className="container__auth">{post.username}</div>
                    <div className="container__text">{post.caption}</div>
                </div>
                {commentnum==0?null:<div className="container__seeMore" onClick={showAllcomment}>查看全部{commentnum}則留言</div>}

                {/* {post.comment.map(({username,message},index)=>{
                    return(
                        <div className="container__msg" key={index}>
                        <div className="container__msg__main">
                            <div className="container__msg__name">{username}</div>
                            <div className="container__msg__msg">{message}</div>
                        </div>
                        <div className="container__msg__like"><FaRegHeart/></div>
                        </div>
                    )
                })} */}
                <div className="container__msg__input">
                    <input className="msg__input"type="text" placeholder="留言..."
                    defaultValue={inputComment}
                    onChange={handleChange}
                    // onCompositionStart={handlingComposition}
                    // onCompositionUpdate={handlingComposition}
                    // onCompositionEnd={handleComposition}
                    onKeyDown={handleKeyDown}
                    ></input>
                </div>
            </div>
            <hr className="container__hr"></hr>
        </div>
        </>
        
    )

}

export default Container;