import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import iphoneLogo from "../../assets/image/iphoneLogo.png"
import logotitle from "../../assets/image/logoTitle.png";
import { auth ,db} from "../../../firebase";
import { signInWithEmailAndPassword,FacebookAuthProvider,signInWithPopup } from "firebase/auth";
import {serverTimestamp,addDoc,doc,getDocs,collection,query, where,onSnapshot} from "firebase/firestore"

const SignIn =()=>{
    const [signinState,setSigninSatate]=useState(true);
    const[account,setAccount]=useState("test@gmail.com");
    const[passeord,setPassword]=useState("test123");
    const [accountWarning,setAccountWarning]=useState("");
    const [passwordWarning,setPasswordWarning]=useState("");
    const [currentEmail,setcurrentEmail]=useState("");
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

    async function facebookSignin (){
        //創建 Facebook 提供者對象的實例
        const provider = new FacebookAuthProvider();
        auth.languageCode = 'it';
        signInWithPopup(auth, provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;
            let useremail=user.email

            if(currentEmail.includes(useremail)){
                navigate("/")
            }else{
            const data={
                dataCreates:serverTimestamp(),
                emailAddress:user.email,
                followers:[],
                following:[],
                fullName:user.displayName,
                introduction:"",
                userId:user.uid,
                username:user.displayName,
                collect:[],
                personImg:user.photoURL
            }
            console.log(data)
            addDoc(collection(db, "user"), data).then((data)=>{
            }).catch((error)=>{
                console.log("輸入資料庫錯誤",error)
            });
            navigate("/");
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("facebook登入錯誤",errorMessage)
            const credential = FacebookAuthProvider.credentialFromError(error);

        });
    }

    useEffect(()=>{
        document.title="InYourLife-登入"
    })
    
    useEffect(()=>{
        const search=async()=>{
            const querySnapshot = await getDocs(collection(db, "user"));
            querySnapshot.forEach((doc) => {
              setcurrentEmail((pre)=>[...pre,doc.data().emailAddress])
            });

        }
        search();

    },[])

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
                            <div className="useGooglesignin__item" onClick={facebookSignin}>使用facebook帳號登入</div>
                        </div>
                    </div>
                    
                    <div className="signup">
                            <div>{signinState?"沒有帳號嗎？":"已註冊帳號"}</div>
                            <Link to="/signup">
                            <div className="signup__Btn">註冊</div>
                            </Link>

                    </div>


                </div>

                </div>

        </div>
    )
}

export default SignIn;