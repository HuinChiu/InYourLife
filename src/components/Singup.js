import React from "react";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import iphoneLogo from "../assets/image/iphoneLogo.png"
import logotitle from "../assets/image/logoTitle.png";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";

const SignUp =()=>{
    // const [signinState,setSigninSatate]=useState(true);
    const[account,setAccount]=useState("test@gmail.com");
    const[passeord,setPassword]=useState("test123");
    const [accountWarning,setAccountWarning]=useState("");
    const [passwordWarning,setPasswordWarning]=useState("");
    const navigate=useNavigate();

    function signIn(){
        setAccountWarning("");
        setPasswordWarning("");
        console.log(account,passeord)
        signInWithEmailAndPassword(auth,account,passeord)
        .then((cred)=>{
            console.log("signIn");
            console.log(cred.user);
            navigate("/")

        })
        .catch((err)=>{
            const errmsg=err.code
            console.log(errmsg)
            setAccountWarning("");
            setPasswordWarning("");
            if (errmsg=="auth/invalid-email"){
                setAccountWarning("請輸入有效帳號/信箱");
            }else if(errmsg=="auth/missing-email"){
                setAccountWarning("未輸入帳號/信箱");
            }else if(errmsg=="auth/internal-error"){
                setPasswordWarning("未輸入密碼");
            }else if (errmsg=="auth/wrong-password"){
                setPasswordWarning("密碼輸入錯誤");
            }else if (errmsg=="auth/user-not-found"){
                setAccountWarning("查無此帳號，請註冊帳號")
            }

        })
    }

    // function signUp(){
    //     console.log(account,passeord)

    //     createUserWithEmailAndPassword(auth,account,passeord)
    //     .then((cred)=>{
    //         console.log("signUP")
    //         console.log(cred.user)
            
    //     })
    //     .catch((err)=>{
    //         const errmsg=err.code;
    //         console.log(errmsg)
    //         if (errmsg=="auth/email-already-in-use"){
    //             setAccountWarning("帳號已被註冊，請重新輸入");
    //         }else if (errmsg=="auth/email-already-in-use"){
    //             setAccountWarning("帳號輸入錯誤，請重新輸入");
    //         }else if (errmsg=="auth/weak-password"){
    //             setPasswordWarning("密碼至少六位數，請重新輸入");
    //         }

    //     })
    // }

    // function clickHandler(){
    //     !signinState?setSigninSatate(true):setSigninSatate(false)
    // }
    useEffect(()=>{
        document.title="InYourLife-登入"
    })
    

    return(
        <div className="main">
            <div className="mainBox">
                <div className="mainImg">
                    <img className="mainLogoImg" src={iphoneLogo}></img>
                </div>
                <div className="mainLog">
                    <div className="loginBox">
                        <div className="Title"><img className="logotitle_img"src={logotitle}></img></div>
                        <div className="signin__item">
                            {/* <label htmlFor="email">帳號</label> */}
                            <input id="email" type="text" placeholder="請輸入電子郵件地址" defaultValue={account}
                            onChange={(e)=>{setAccount(e.target.value)}}></input>
                            <div className="signin__warning" >{accountWarning}</div>
                        </div>
                        <div className="signin__item">
                            {/* <label htmlFor="password">密碼</label> */}
                            <input type="password" id="password" placeholder="請輸入密碼" defaultValue={passeord}
                            onChange={(e)=>{setPassword(e.target.value)}}></input>
                            <div className="signin__warning">{passwordWarning}</div>
                        </div>
                        <div className=" signin__item signin__btn" onClick={signIn}>登入</div>
                        <div className="dividing">
                            <hr/>或<hr/>
                        </div>
                        <div className="useGooglesignin">
                            <div className="useGooglesignin__item">使用facebook帳號登入</div>
                            <div className="useGooglesignin__item">忘記密碼</div>
                        </div>
                    </div>
                    
                    <div className="signup">
                            <div>{signinState?"沒有帳號嗎？":"已註冊帳號"}</div>
                            <div className="signup__Btn" onClick={clickHandler}>註冊
                    </div>


                </div>

                </div>

        </div>
    </div>
    )
}

export default SignUp;