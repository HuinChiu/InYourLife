import { useState,useEffect, useRef } from "react";
import {update,doc,getDoc,where,collection,updateDoc,query,getDocs,arrayRemove,arrayUnion,onSnapshot,deleteDoc} from "firebase/firestore"
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
    const [allComment,setAllComment]=useState([])
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
    //計算圖片輪播
    const [totalimgCount, setToalImgCount] = useState(0);
    const [currentImgCount, setCurrentImgCount] = useState(0);
    const [splitComment,setSplitComment]=useState([])
    const imageRef=useRef(null)
    //有無關注
    const [following,setFollowing]=useState(false)
    const followTrueRef=useRef(null)
    const followFalseRef=useRef(null)
    //composition事件
    const composingRef = useRef(false);
    const [value, onChange] = useState('');
    const [composingValue, setComposingValue] = useState('');
    const innerValue = composingRef.current ? composingValue : value ?? '';




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
            const unsub = onSnapshot(doc(db, "posts", dataId), (doc) => {
                console.log("Current data: ", doc.data().comment);
                const comment= doc.data().comment
                const allcommentNum=doc.data().comment.length
                const sliceComment=comment.slice(-2)
                //找出全部留言
                if(comment===undefined){
                    setAllComment([])
                    setSplitComment([])
                }else if(allcommentNum<3){
                    setSplitComment(comment)
                    setAllComment(comment)
                }
                else{
                    setAllComment(comment)
                    setSplitComment(sliceComment)
                }

                //找出留言總數
                if (allcommentNum==undefined){
                    setCommentnum(0)
                }else{
                    setCommentnum(allcommentNum)
                }

            });

            
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

            //找出有無關注
            const following=memberData.following
            if(following === undefined){
                return
            }else{
                if(following.includes(post.uid)){
                    setFollowing(true)
                }
            }
            //確認使用者是否有追蹤貼文
            const userFollow =memberData.following
            userFollow.includes(post.uid)
            if(userFollow.includes(post.uid)){
                setFollowing(true)
            }


        }

        renderFirst();

    },[memberData,following,like,setFollowing])

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



    const handleSend=async ()=>{
        const washingtonRef=doc(db,"posts",dataId);
        updateDoc(washingtonRef,{
            comment:arrayUnion(
            {
                uid:memberData.userId,
                username:memberData.username,
                message:composingValue,
            })}
            )
        composingRef.current.value="";
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
          // 中文输入完毕，此时触发onChange
          console.log(newStr)
        }
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

    //點擊關注
    async function clickFollow(){
        //將貼文作者uid加到自己追蹤名單裡
        const washingtonRef = doc(db, "user", memberId);
        await updateDoc(washingtonRef, {
            following: arrayUnion(post.uid)
        });
        //查找貼文作者userId
        const q = query(collection(db, "user"), where("userId", "==", post.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((data) => {
                const washingtonRef = doc(db, "user", data.id);
                updateDoc(washingtonRef, {
                        followers: arrayUnion(memberData.userId)
                    });
                setFollowing(true)
            });


    }

    //取消關注
    async function clickCancelFollow(){
        //自己追蹤名單裡移除作者uid
        const washingtonRef = doc(db, "user", memberId);
        await updateDoc(washingtonRef, {
            following: arrayRemove(post.uid)
        });
        console.log("取消追蹤！",post.uid)
        //作者關注者中移除使用者uid
        const q = query(collection(db, "user"), where("userId", "==", post.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((data) => {
                console.log("找到貼文資料！",data.id, " => ", data.data()); //查找到貼文作者資料
                const washingtonRef = doc(db, "user", data.id);
                updateDoc(washingtonRef, {
                        followers: arrayRemove(memberData.userId)
                    });
                console.log("取消追蹤者到貼文作者內")
 
            });
        setFollowing(false)
    }

    

    
    return(
        <>
            <div className="container">
            { clickShowAllcomment?<ShowAllcomment
                like={like}
                handleDisLike={handleDisLike}
                handleLike={handleLike}
                handleSend={handleSend}
                likestyle={likestyle}
                style={style}
                images={post.images}
                memberData={memberData}
                caption={post.caption}
                postLikeCount={likeCount}
                dataId={dataId}
                setclickShowAllComment={setclickShowAllComment}
                handleMark={handleMark}
                clickMark={clickMark}
                setClickMark={setClickMark}
                onChange={handleChange}
            />:null}
            { clickDelete?<DeleteAlert
            handleDelete={handleDelete}
            dataId={dataId}
            memberId={memberId}
            ></DeleteAlert>:null
            }
                <div className="container__name">
                    <div className="container__name__title">
                        <div className="container__name__personImagebox">
                            <img className="container__name__personImage" src={posterImg}></img>
                            <div className="container__name__username">{post.username}</div>
                            {(theSameUID||following)?null:<div ref={followFalseRef}className="container__follow" onClick={clickFollow}>追蹤</div>}
                            {following?<div ref={followTrueRef} onClick={clickCancelFollow} className="container__follow__true">追蹤中</div>:null}
                        </div>

                        <div  className="container__deletePost" onClick={handleDelete}>{theSameUID?<CgClose/>:null}</div>
                    </div>
                </div>
            <div className="container__picture">
                {(totalimgCount==1 ||currentImgCount == 0 )?null : (<div className="picture__Leftbtn" >
                    <BiChevronLeftCircle style={{width:"30px",height:"30px",color:"rgba(0,0,0,0.7)"}}
                    onClick={clickPreviousPicture}/></div>)}
                
                <div className="picture__main">
                    <div className="post__main__picture" ref={imageRef} 
                    style={{backgroundImage:`url(${post.images[currentImgCount]})`}}></div>
                </div>
                <div className="picture__like">
                    {showLike?<FaHeart style={{width:"30%",height:"30%",color:"#e42c64"}}/>:null}
                </div>
                {(totalimgCount==1 ||currentImgCount + 1 == totalimgCount) ? null : (<div className="picture__Rightbtn" >
                    <BiChevronRightCircle style={{width:"30px",height:"30px",color:"rgba(0,0,0,0.7)"}}
                    onClick={clickNextPicture}/></div>)}
                <div className="picture__dot">
                    {post.images.map((data,index)=>{
                        return(
                            <div  className={`dot dot${index}`} key={index} onClick={()=>{goToSlide(index)}}></div>
                        )
                    })}
                </div>
            </div>
            <div className="container__icon">
                <div className="container__icon__left">
                    <div className="caption__icon__like" onClick={like?handleDisLike:handleLike}>
                        {like?<FaHeart style={likestyle}/>:<FaRegHeart style={style}/>}
                    </div>
                    <div className="caption__icon__msg" onClick={showAllcomment}><FiMessageSquare style={style}/></div>
                    {/* <div className="caption__icon__sendMsg"><FiSend style={style}/></div> */}
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
                {splitComment?splitComment.map(({username,message},index)=>{
                    return(
                        <div className="container__msg" key={index}>
                        <div className="container__msg__main">
                            <div className="container__msg__name">{username}</div>
                            <div className="container__msg__msg">{message}</div>
                        </div>
                        {/* <div className="container__msg__like"><FaRegHeart/></div> */}
                        </div>
                    )
                }):null}
                {commentnum<3?null:<div className="container__seeMore" onClick={showAllcomment}>查看全部{commentnum}則留言</div>}
                <div className="container__msg__input">
                    <input className="msg__input"type="text" placeholder="留言..."
                    ref={composingRef}
                    onChange={handleChange}
                    onKeyPress={(e)=>{if (e.key === "Enter"){handleSend();}}}
                    ></input>
                </div>
            </div>
            <hr className="container__hr"></hr>
        </div>
        </>
        
    )

}

export default Container;