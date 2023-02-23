import { useState,useEffect } from "react";
import {doc,deleteDoc} from "firebase/firestore"
import { db } from "../../../firebase";
import {BiDotsHorizontalRounded} from "react-icons/bi"
import {FaRegHeart,FaHeart} from "react-icons/fa"
import {FiMessageSquare} from "react-icons/fi"
import{FiSend} from "react-icons/fi"
import {BiBookmark} from "react-icons/bi"
import{BiChevronLeftCircle} from "react-icons/bi"
import{BiChevronRightCircle} from "react-icons/bi"


function Container({username,caption,images,personImg}){
    //icon style
    const style= {padding:'10px',width:"25px",height:"25px"};
    const likestyle= {padding:'10px',width:"25px",height:"25px",color:"#e42c64"};

    //state
    const [like,setLike]=useState(false);
    const [showLike,setShowLike]=useState(false);

    function likeClick(){
        if (like == false){
            setLike(true)
            setShowLike(true)
            setTimeout(function() {
                setShowLike(false)
                   }, 1000)
        }else{
            setLike(false);
            setShowLike(false)
        }
    }

    function deletePost(){

    }


    
    return(
        <>
            <div className="container">
                <div className="container__name">
                    <div className="container__name__title">
                        <div className="container__name__personImagebox">
                            <img className="container__name__personImage" src={personImg}></img>
                            <div className="container__name__username">{username}</div>
                        </div>

                        <div><BiDotsHorizontalRounded/></div>
                    </div>
                </div>
            <div className="container__picture">
                <div className="picture__Leftbtn"><BiChevronLeftCircle></BiChevronLeftCircle></div>
                
                <div className="picture__main">
                    <img className="post__main__picture"src={images}></img>
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
                    <div onClick={likeClick}>
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
                <div className="container__msg">
                    <div className="container__msg__main">
                        <div className="container__msg__name">Una</div>
                        <div className="container__msg__msg">我是留言內容</div>
                    </div>
                    <div className="container__msg__like"><FaRegHeart/></div>
                </div>
                <div className="container__msg">
                    <div className="container__msg__main">
                        <div className="container__msg__name">Una</div>
                        <div className="container__msg__msg">我是留言內容</div>
                    </div>
                    <div className="container__msg__like"><FaRegHeart/></div>
                </div>
                <div className="container__msg__input">
                    <input className="msg__input"type="text" placeholder="留言..."></input>
                </div>
            </div>
            <hr className="container__hr"></hr>
        </div>
        </>
        
    )

}

export default Container;