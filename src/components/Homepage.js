import { useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { auth,storage } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc,setDoc,getDocs,collection, updateDoc,onSnapshot,where,query} from "firebase/firestore";
import { db } from "../../firebase";
import SideBar from "./homepage/sidebar";
import Main from "./homepage/main";
import PersionPage from "./person";
import CreateNewPage from "./createNewPage";
import Setting from "./setting";

function HomePage(){
    const navigate=useNavigate();

    const[clickPerson,setCLickPerson]=useState(false);
    const [clickCreateNewPage,setCreateNewPage]=useState(false);

    const [memberData,setMemberData]=useState({});
    const [fullName,setFullName]=useState("");
    const [userName,setUsername]=useState("");
    const [followers,setFollowers]=useState(0);
    const [following,setFollowing]=useState(0);
    const [memberId,setMemberId]=useState("");
    const [personImg,setPersonImg]=useState("");
    const [setting,setSetting]=useState(false);
    

    //確認是否登入並獲取資料
    async function checkSinIN(){
        //獲取當前會員的uid
        let uidData="";
        await onAuthStateChanged(auth,(user)=>{
            if(user){
                const uid=user.uid;
                uidData=uid;
                console.log("我是獲取當前會員",uidData)
                //撈取資料庫內當前會員資料
                const uidRef =query(collection(db,"user"),where("userId","==",uidData))
                onSnapshot(uidRef,(snapshots)=>{
                    snapshots.docs.forEach( a => {
                        console.log(a.id)
                        const user=a.data();
                        console.log("我是查詢到的會員資料",user)
                        setMemberData(user)
                        setUsername(user.username);
                        setFullName(user.fullName);
                        setFollowers(user.followers.length);
                        setFollowing(user.following.length);
                        setPersonImg(user.personImg)
                        setMemberId(a.id)
                    })
                })
            }
            else{
                console.log("未登入");
                navigate("/signin");
            }
        })
        console.log("我是最後的uidData",uidData)  //印出獲取當前會員uid結果
        console.log(memberId)

    };

    useEffect(()=>{
        checkSinIN();
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
    function clickSetting(){
        !setting?setSetting(true):setSetting(false)
        console.log("clickSeeting")
    }





    return(
        <>
        <div className="homeBox">

            <SideBar clickPersonHandler={clickPersonHandler}
                    clickCreatNewHandler={clickCreatNewHandler}
                    clickBackHomePage={clickBackHomePage}
                    memberData={memberData}
                    personImg={personImg}

            ></SideBar>
            <div className="homeMain">
                {setting?
                <Setting memberData={memberData}
                clickSetting={clickSetting}
                memberId={memberId}
                />:
                null}
                {clickPerson?<PersionPage 
                memberData={memberData}
                personImg={personImg}
                setPersonImg={setPersonImg}
                memberId={memberId}
                clickSetting={clickSetting}
                />:
                <Main
                memberData={memberData}
                />}
            </div>
            {clickCreateNewPage?<CreateNewPage 
            clickCreatNewHandler={clickCreatNewHandler}
            memberData={memberData}
            personImg={personImg}
            />:null}

        </div>
        </>
    )
}

export {HomePage};