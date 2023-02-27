import { useState,useEffect } from "react";
import {doc,getDoc,collection,updateDoc,query,arrayUnion,arrayRemove} from "firebase/firestore"
import { db } from "../../../firebase";
import {BiDotsHorizontalRounded} from "react-icons/bi"
import {FaRegHeart,FaHeart} from "react-icons/fa"
import {FiMessageSquare} from "react-icons/fi"
import{FiSend} from "react-icons/fi"
import {BiBookmark} from "react-icons/bi"
import{BiChevronLeftCircle} from "react-icons/bi"
import{BiChevronRightCircle} from "react-icons/bi"


function Container({memberId,username,caption,images,personImg,comment,dataId,memberData}){
    //icon style
    const style= {padding:'10px',width:"25px",height:"25px"};
    const likestyle= {padding:'10px',width:"25px",height:"25px",color:"#e42c64"};

    console.log("我是container comment",comment)
    //state
    const [like,setLike]=useState(false);
    const [showLike,setShowLike]=useState(false);
    const [inputComment,setInputComment]=useState("")
    const [userIsLikeData,setUserIsLikeData]=useState([])
    const [userImg,setUserImg]=useState("")


    useEffect(()=>{
        console.log("我是container UserName",memberData.username)
        async function checkMemberLike(){
            //查找資料庫裡post資料
            const docRef = doc(db,"posts",dataId)
            const docSnap = await getDoc(docRef);
            //post裡like列表
            const likeData=docSnap.data().like
            console.log("我是likedata",likeData)
            const userLikeData=await likeData.filter((data)=>{
                return data.username==memberData.username          
            })
            console.log("我是資料庫外userLikerData",userLikeData)
            if(userLikeData.length===0){
                console.log("未按讚過")
                const washingtonRef=doc(db,"posts",dataId);
                await updateDoc(washingtonRef,{
                    like:arrayUnion(
                        {
                        uid:memberData.userId,
                        username:memberData.username,
                        like:false,
                        })
                    }
                )
            }else{
                setUserIsLikeData(userLikeData)
                //如果獲取到的資料是true顯示true
                if (userLikeData[0].like===true){
                    setLike(true)
                }
            }

        }

        checkMemberLike();
    },[])

    //獲取資料庫user最新頭像
    // const userImage= async ()=>{
    //     const docRef = doc(db, "user", memberId);
    //     const docSnap = await getDoc(docRef);
    //     if (docSnap.exists()) {
    //         console.log("Document data:", docSnap.data().personImg);
    //         const memberImage=docSnap.data().personImg
    //         setUserImg(memberImage)
    //       } else {
    //         // doc.data() will be undefined in this case
    //         console.log("No such document!");
    //       }
    // }

    // useEffect(()=>{
    //     userImage();
    // },[])

    //如果是like:true點擊改為false
    const handleLike=async ()=>{
        console.log("我是click like true",userIsLikeData)
        setLike(true)
        setShowLike(true)
        setTimeout(function() {
            setShowLike(false)
        }, 1000)
        const washingtonRef=doc(db,"posts",dataId);
        await updateDoc(washingtonRef,{
            like:arrayUnion(
                {
                uid:memberData.userId,
                username:memberData.username  ,
                like:true,
                })
            }
        )
        await updateDoc(washingtonRef,{
            like:arrayRemove(
                {   
                    uid:memberData.userId,
                    username:memberData.username  ,
                    like:false
                }
            )
        })
    }
    //如果是like:true點擊改為false
    const handleDisLike=async ()=>{
        setLike(false)
        const washingtonRef=doc(db,"posts",dataId);
        await updateDoc(washingtonRef,{
            like:arrayUnion(
                {
                username:memberData.username,
                like:false,
                })
            }
        )
        await updateDoc(washingtonRef,{
            like:arrayRemove(
                {
                    uid:memberData.userId,
                    username:memberData.username,
                    like:true
                }
            )
        })
    }



    //獲取留言框的值加入至資料庫
    const handleChange=(e)=>{
        setInputComment(e.target.value)
    }
    const handleKeyDown=async (e)=>{
        e.stopPropagation()
        if(e.key === "Enter" && e.key ==="Enter"){
            console.log("enter!")
            const washingtonRef=doc(db,"posts",dataId);
            await updateDoc(washingtonRef,{
                comment:arrayUnion(
                    {
                    uid:memberData.userId,
                    username:memberData.username,
                    message:inputComment,
                }
                    ),

            }
            
            ).then(()=>{
                console.log("留言更新完成")
            }).catch((error)=>{
                console.log(error)
            }).finally(()=>{
                setInputComment("");
                console.log("setInput為空值")
            })
        }
    }




    
    return(
        <>
            <div className="container">
                <div className="container__name">
                    <div className="container__name__title">
                        <div className="container__name__personImagebox">
                            <img className="container__name__personImage" src={userImg}></img>
                            <div className="container__name__username">{username}</div>
                        </div>

                        <div><BiDotsHorizontalRounded/></div>
                    </div>
                </div>
            <div className="container__picture">
                {/* <div className="picture__Leftbtn"><BiChevronLeftCircle></BiChevronLeftCircle></div> */}
                
                <div className="picture__main">
                    <img className="post__main__picture"src={images}></img>
                </div>
                <div className="picture__like">
                    {showLike?<FaHeart style={{width:"30%",height:"30%",color:"#e42c64"}}/>:null}
                </div>
                {/* <div className="picture__Rightbtn"><BiChevronRightCircle></BiChevronRightCircle></div>
                <div className="picture__dot">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div> */}
            </div>
            <div className="container__icon">
                <div className="container__icon__left">
                    <div onClick={like?handleDisLike:handleLike}>
                        {like?<FaHeart style={likestyle}/>:<FaRegHeart style={style}/>}
                    </div>
                    <div><FiMessageSquare style={style}/></div>
                    <div><FiSend style={style}/></div>
                </div>
                <div>
                    <BiBookmark style={style}/>
                </div>
            </div>
            <div className="container__main">
                <div className="container__like">
                    <div className="like_name">Stacy</div>
                    <div className="like__count">和其他{600}人都說讚</div>
                </div>
                <div className="container__content">
                    <div className="container__auth">{username}</div>
                    <div className="container__text">{caption}</div>
                </div>
                {comment.map(({username,message},index)=>{
                    return(
                        <div className="container__msg" key={index}>
                        <div className="container__msg__main">
                            <div className="container__msg__name">{username}</div>
                            <div className="container__msg__msg">{message}</div>
                        </div>
                        <div className="container__msg__like"><FaRegHeart/></div>
                        </div>
                    )
                })}
                <div className="container__msg__input">
                    <input className="msg__input"type="text" placeholder="留言..."
                    defaultValue={inputComment}
                    onChange={handleChange}
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