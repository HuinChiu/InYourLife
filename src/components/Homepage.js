import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc,setDoc,getDocs,collection, updateDoc} from "firebase/firestore";
import { db } from "../../firebase";
import SideBar from "./homepage/sidebar";
import Main from "./homepage/main";
import PersionPage from "./person";
import CreateNewPage from "./createNewPage";

function HomePage(){
    const navigate=useNavigate();

    const[clickPerson,setCLickPerson]=useState(false)
    const [clickCreateNewPage,setCreateNewPage]=useState(false)

    const [fullName,setFullName]=useState("")
    const [userName,setUsername]=useState("")
    const [followers,setFollowers]=useState(0)
    const [following,setFollowing]=useState(0)
    const [memberId,setMemberId]=useState("")
    const [personImg,setPersonImg]=useState("")
    
    //確認是否登入並獲取資料
    async function checkSinIN(){
        //獲取當前會員的uid
        let uidData="";
        await onAuthStateChanged(auth,(user)=>{
            if(user){
                const uid=user.uid;
                uidData=uid;
            }
            else{
                navigate("/signin");

            }
        })
        console.log("我是最後的uidData",uidData)  //印出獲取當前會員uid結果

        //撈取資料庫內當前會員資料
        const uidRef =collection(db,"user")
        const snapshots = await getDocs(uidRef)
        const docs =snapshots.docs.map((doc)=>{
            const data=doc.data()
            data.id=doc.id
            return data
        })
        //找出當前會員資料比對
        for (let i of docs){
            console.log(i.userId)
            if (uidData === i.userId){
                console.log("我是當前會員資料",i)
                setUsername(i.username);
                setFullName(i.fullName);
                setFollowers(i.followers.length);
                setFollowing(i.following.length);
                setPersonImg(i.personImg)
                setMemberId(i.id)
            }
        }


    };

    useEffect(()=>{
        checkSinIN()
    },[])

    //確認是否案個人網頁，true跳轉至個人頁面
    function clickPersonHandler(){
        !clickPerson?setCLickPerson(true):null
    }
    //確認是否新增貼文，true顯示貼文創建頁面
    function clickCreatNewHandler(){
        !clickCreateNewPage?setCreateNewPage(true):setCreateNewPage(false)
    }
    //確認是否返回首頁，true返回首頁
    function clickBackHomePage(){
        clickPerson?setCLickPerson(false):null
        navigate("/")
    }





    return(
        <>
        <div className="homeBox">

            <SideBar clickPersonHandler={clickPersonHandler}
                    clickCreatNewHandler={clickCreatNewHandler}
                    clickBackHomePage={clickBackHomePage}
                    personImg={personImg}

            ></SideBar>
            <div className="homeMain">
                {clickPerson?<PersionPage 
                fullName={fullName}
                userName={userName}
                followers={followers}
                following={following}
                memberId={memberId}
                personImg={personImg}
                setPersonImg={setPersonImg}
                />:<Main/>}
            </div>
            {clickCreateNewPage?<CreateNewPage 
            clickCreatNewHandler={clickCreatNewHandler}
            userName={userName}
            personImg={personImg}
            />:null}

        </div>
        </>
    )
}

export default HomePage;