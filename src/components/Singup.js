import { useState,useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import iphoneLogo from "../assets/image/iphoneLogo.png"
import logotitle from "../assets/image/logoTitle.png";
import { auth,db } from "../../firebase";
import { collection,addDoc, serverTimestamp,query,where,onSnapshot } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp =()=>{
    // const [signinState,setSigninSatate]=useState(true);
    const[account,setAccount]=useState("test@gmail.com");
    const [fullName,setFullName]=useState("Test Name");
    const [username,setUsername]=useState("Hi_test")
    const[passeord,setPassword]=useState("test123");
    const [accountWarning,setAccountWarning]=useState("");
    const [passwordWarning,setPasswordWarning]=useState("");
    const [usernameWarning,setUsernameWarning]=useState("")
    const navigate=useNavigate();
    //註冊
    function signUp(){
        setUsernameWarning("")
        const uidRef =query(collection(db,"user"),where("username","==",username))
        onSnapshot(uidRef,(snapshots)=>{
            if(snapshots.docs.length>0){
                setUsernameWarning("使用者名稱已存在，請重新輸入")
            }
        })


        createUserWithEmailAndPassword(auth,account,passeord)
        .then((cred)=>{
            console.log("signUP")
            const uid=cred.user.uid
            setAccountWarning("帳號註冊成功")
            const data={
                dataCreates:serverTimestamp(),
                emailAddress:account,
                followers:[],
                following:[],
                fullName:fullName,
                userId:uid,
                username:username,
                personImg:"https://firebasestorage.googleapis.com/v0/b/inyourlife-716bb.appspot.com/o/logo2.png?alt=media&token=ded852ae-30df-49ba-827f-6db4dcea6376"
            }
            console.log(data)
            addDoc(collection(db, "user"), data).then((data)=>{
                console.log(data); 
            });
            navigate("/");

        })
        .catch((err)=>{
            const errmsg=err.code;
            console.log(errmsg)
            if (errmsg=="auth/email-already-in-use"){
                setAccountWarning("帳號已被註冊，請重新輸入");
                setAccount("");
            }else if (errmsg=="auth/invalid-email"){
                setAccountWarning("帳號輸入錯誤，請重新輸入");
                setAccount("");
            }else if (errmsg=="auth/weak-password"){
                setPasswordWarning("密碼至少六位數，請重新輸入");
                setPassword("");
            }

        })

    }

    useEffect(()=>{
        document.title="InYourLife-註冊"
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
                            <input id="email" type="text" placeholder="請輸入電子郵件地址" defaultValue={account}
                            onChange={(e)=>{setAccount(e.target.value)}}></input>
                            <div className="signin__warning" >{accountWarning}</div>
                        </div>
                        <div className="signin__item">
                            <input id="fullName" type="text" placeholder="請輸入全名" defaultValue={fullName}
                            onChange={(e)=>{setFullName(e.target.value)}}></input>
                            <div className="signin__warning" ></div>
                        </div>
                        <div className="signin__item">
                            <input id="userName" type="text" placeholder="請輸入用戶名稱" defaultValue={username}
                            onChange={(e)=>{setUsername(e.target.value)}}></input>
                            <div className="signin__warning" >{usernameWarning}</div>
                        </div>
                        <div className="signin__item">
                            <input type="password" id="password" placeholder="請輸入密碼" defaultValue={passeord}
                            onChange={(e)=>{setPassword(e.target.value)}}></input>
                            <div className="signin__warning">{passwordWarning}</div>
                        </div>
                        <div className=" signin__item signin__btn" onClick={signUp}>註冊</div>

                        <div className="dividing">
                            <hr/>或<hr/>
                        </div>
                        <div className="useGooglesignin">
                            <div className="useGooglesignin__item">使用facebook帳號登入</div>
                            <div className="useGooglesignin__item">忘記密碼</div>
                        </div>
                    </div>
                    
                    <div className="signup">
                            <div>已註冊帳號</div>
                            <Link to ="/signin">
                                <div className="signup__Btn">登入</div>
                            </Link>

                    </div>


                </div>

                </div>

        </div>
    )
}

export default SignUp;