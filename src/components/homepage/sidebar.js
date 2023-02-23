import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import {BsInstagram }from "react-icons/bs";
import {AiFillHome} from "react-icons/ai"
import {BsSearch} from "react-icons/bs"
import {RiMessengerLine} from "react-icons/ri"
import {FaRegHeart} from "react-icons/fa"
import {MdOutlineAddBox} from "react-icons/md"
import {BiCircle} from "react-icons/bi"
import {RxHamburgerMenu} from 'react-icons/rx'
import logotitle from "../../assets/image/logoTitle.png";
import { signOut } from "firebase/auth";

function SideBar({clickPersonHandler,clickCreatNewHandler,clickBackHomePage,personImg}){
    const style= {padding:'20px',width:"25px",height:"25px"}
    const [openMore,setOpenMore]=useState(false)
    //登出後導回首頁
    const navigate=useNavigate()



    function signOUT(){
      console.log("signout");
      signOut(auth)
      .then(()=>{
        console.log("signout successful")
        navigate("/")

      })
      .catch((error)=>{
        console.log(error.code)
      })  
    }

    function clickHandler(){//確認是否點擊更多，點擊更多跳出登出
        !openMore?setOpenMore(true):setOpenMore(false)

    }


    return(
    <>
        <div className="leftSideBar">
            <div className="mainLogo" onClick={clickBackHomePage}>
                <img className="sideBarLogo" src={logotitle}/>
                <div className="sideBarLogo__ins"><BsInstagram style={style}/></div>
            </div>
            <div className="otherLogo">
                <div className="otherLogo__group">
                    <div className="otherLogo__item" onClick={clickBackHomePage}>
                        <AiFillHome style={style}/><div className="otherLogo__item__title">首頁</div>
                    </div>
                    <div className="otherLogo__item">
                        <BsSearch style={style}/><div className="otherLogo__item__title">搜尋</div>
                    </div>
                    <div className="otherLogo__item">
                        <RiMessengerLine style={style}/><div className="otherLogo__item__title">訊息</div>
                    </div>
                    <div className="otherLogo__item">
                        <FaRegHeart style={style}/><div className="otherLogo__item__title">通知</div>
                    </div>
                    <div className="otherLogo__item" onClick={clickCreatNewHandler}>
                        <MdOutlineAddBox style={style}/><div className="otherLogo__item__title">建立</div>
                    </div>
                    <div className="otherLogo__item" onClick={clickPersonHandler}>
                        <div className="otherLogo__item__personImg">
                            <img className="personImg" src={personImg}></img>
                        </div>
                        <div className="otherLogo__item__title">個人檔案</div>
                    </div>
                </div>

                <div className="hamburger">
                    <div className="otherLogo__item" onClick={clickHandler}>
                        <RxHamburgerMenu style={style}/>
                        <div className="otherLogo__item__title" >更多</div>
                        {openMore?<div className="signout" onClick={signOUT}>登出</div>:null}
                    </div>
                </div>
            </div>


        </div>
    </>
    )

}

export default SideBar;