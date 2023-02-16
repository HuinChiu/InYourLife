import React from "react";
import { useState } from "react";
import {BiCircle} from "react-icons/bi"
import {BiDotsHorizontalRounded} from "react-icons/bi"
import {FaRegHeart,FaHeart} from "react-icons/fa"
import {FiMessageSquare} from "react-icons/fi"
import{FiSend} from "react-icons/fi"
import {BiBookmark} from "react-icons/bi"
import{BiChevronLeftCircle} from "react-icons/bi"
import{BiChevronRightCircle} from "react-icons/bi"


function Container(){
    //icon style
    const style= {padding:'10px',width:"25px",height:"25px"}
    const likestyle= {padding:'10px',width:"25px",height:"25px",color:"#e42c64"}

    //state
    const [like,setLike]=useState(false)
    const likeClick=()=>{!like?setLike(true):setLike(false)}
        
    
    return(
        <>
            <div className="container">
            <div className="container__name">
                <div className="container__name__title"><BiCircle/><div>hi_chiuchiu</div></div>
                <div><BiDotsHorizontalRounded/></div>
            </div>
            <div className="container__picture">
                <div className="picture__Leftbtn"><BiChevronLeftCircle></BiChevronLeftCircle></div>
                
                <div className="picture__main"></div>
                <div className="picture__like">
                    {like?<FaHeart style={{width:"30%",height:"30%",color:"#e42c64"}}/>:""}

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
                    <div onClick={likeClick}>{like?<FaHeart style={likestyle} />:<FaRegHeart style={style}/>}</div>
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
                    <div className="continaer__auth">Stacy</div>
                    <div className="container__text">哇啦哇啦哇啦哇啦我是模擬發文內容</div>
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
        <div className="container">
            <div className="container__name">
                <div className="container__name__title"><BiCircle/><div>hi_chiuchiu</div></div>
                <div><BiDotsHorizontalRounded/></div>
            </div>
            <div className="container__picture">
                <div className="picture__Leftbtn"><BiChevronLeftCircle></BiChevronLeftCircle></div>
                <div className="picture__main"></div>
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
                    <FaRegHeart style={style}/>
                    <FiMessageSquare style={style}/>
                    <FiSend style={style}/>
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
                    <div className="continaer__auth">Stacy</div>
                    <div className="container__text">哇啦哇啦哇啦哇啦我是模擬發文內容</div>
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

        </div>
        </>
        
    )

}

export default Container;