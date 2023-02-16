import React from "react";
import {BsInstagram }from "react-icons/bs";
import {AiFillHome} from "react-icons/ai"
import {BsSearch} from "react-icons/bs"
import {RiMessengerLine} from "react-icons/ri"
import {FaRegHeart} from "react-icons/fa"
import {MdOutlineAddBox} from "react-icons/md"
import {BiCircle} from "react-icons/bi"
import {RxHamburgerMenu} from 'react-icons/rx'
import logotitle from "../../assets/image/logoTitle.png";

function NavBar(){
    const style= {padding:'20px',width:"25px",height:"25px"}
    return(
    <>
        <div className="leftSideBar">
            <div className="mainLogo">
                <img className="sideBarLogo" src={logotitle}/>
                <div className="sideBarLogo__ins"><BsInstagram style={style}/></div>
            </div>
            <div className="otherLogo">
                <div className="otherLogo__group">
                    <div className="otherLogo__item"><AiFillHome style={style}/><div className="otherLogo__item__title">首頁</div></div>
                    <div className="otherLogo__item"><BsSearch style={style}/><div className="otherLogo__item__title">搜尋</div></div>
                    <div className="otherLogo__item"><RiMessengerLine style={style}/><div className="otherLogo__item__title">訊息</div></div>
                    <div className="otherLogo__item"><FaRegHeart style={style}/><div className="otherLogo__item__title">通知</div></div>
                    <div className="otherLogo__item"><MdOutlineAddBox style={style}/><div className="otherLogo__item__title">建立</div></div>
                    <div className="otherLogo__item"><BiCircle style={style}/><div className="otherLogo__item__title">個人檔案</div></div>
                </div>

                <div className="hamburger">
                    <div className="otherLogo__item"><RxHamburgerMenu style={style}/><div className="otherLogo__item__title">更多</div></div>
                </div>
            </div>


        </div>
    </>
    )

}

export default NavBar;