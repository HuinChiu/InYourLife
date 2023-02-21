import React from "react";
import { useEffect,useState } from "react";
import { db,auth,storage } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc,setDoc,getDocs,collection, updateDoc} from "firebase/firestore";
import { ref, uploadBytesResumable,getDownloadURL  } from "firebase/storage";
import {BsGrid3X3} from "react-icons/bs"
import {BiBookmark} from "react-icons/bi"
import {FaHeart} from "react-icons/fa"
import {FiMessageSquare} from "react-icons/fi"
function PersionPage(){
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
    
    //點擊頭像上傳新的照片
    async function handleUpload(e){
        console.log("click upload")
        const file =e.target.files[0];
        console.log(file)
        if (!file) return;
        await uploadImg(file);
        console.log("uploadImng之後",personImg)

    }
    //上傳至storage
    async function uploadImg(file){
        const storageRef=ref(storage,`/user/${file.name}`);
        const uploadTask=uploadBytesResumable(storageRef, file);
        
        uploadTask.on("state_changed",(snapshot)=>{
            const progress=Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
            console.log(progress,"%")

        },(error)=>{console.log(error.message)},
        ()=>{//獲取上傳storage的url
            getDownloadURL(uploadTask.snapshot.ref)
            .then(async (url)=>{
                setPersonImg(url)
                const washingtonRef = doc(db, "user", memberId);
                await updateDoc(washingtonRef,{
                    personImg:url
                }).then(()=>{
                    console.log("update!")
                })
                .catch((error)=>console.log(error)) 
            })
        })
    }
    // //將個人照片url上傳至user資料庫
    // async function updatePersonImg(){
    //     console.log("更新direstore",memberId)


    // }




    return(
        <>
            <div className="personDocument">
                <div className="personDocument__img">
                    <label htmlFor ="uploadPersonimg">
                    <input id="uploadPersonimg" type="file" accept="image/*" style={{display:"none"}} onChange={handleUpload}/>
                    <div className="person__Img" style={{
                                backgroundImage: `url(${personImg})`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                    }}>

                    </div>
                    </label>
                </div>
                <div className="personInfomation">
                    <div className="personInfomation__item">
                        <div className="personInfomation__id-name">{userName}</div>
                        <div className="personInfomation__edit">編輯個人檔案</div>
                    </div>
                    <div className="personInfomation__item">
                        <div className="personInfomation__item-num"><div className="post_num">51</div>貼文</div>
                        <div className="personInfomation__followers-num"><div className="post_num">{followers}</div>粉絲</div>
                        <div className="personInfomation__following-num"><div className="post_num">{following}</div>追蹤中</div>
                    </div>
                    <div className="personInfomation__item">
                        <div className="personInfomation__name">{fullName}</div>
                    </div>
                </div>
            </div>
            <hr className="person__hr"></hr>
            <div className="personInfomation__select">
                <div className="personInfomation__select__item">
                    <div className="select_icon"><BsGrid3X3/></div>
                    <div className="select_title">貼文</div>
                </div>
                <div className="personInfomation__select__item">
                    <div className="select_icon"><BiBookmark/></div>
                    <div className="select_title">收藏</div>
                </div>
            </div>
            <div className="person_post">
                <div className="person_post__item">
                    <div className="item__img">
                        
                    </div>
                    <div className="item__status">
                        <div className="item__status_heart"><FaHeart></FaHeart>3</div>
                        <div className="item__status_msg"><FiMessageSquare ></FiMessageSquare>5</div>
                    </div>
                </div>
                <div className="person_post__item">
                    <div className="item__img">
                        
                    </div>
                    <div className="item__status">
                        <div className="item__status_heart"><FaHeart></FaHeart>3</div>
                        <div className="item__status_msg"><FiMessageSquare ></FiMessageSquare>5</div>
                    </div>
                </div>
                <div className="person_post__item">
                    <div className="item__img">
                        
                    </div>
                    <div className="item__status">
                        <div className="item__status_heart"><FaHeart></FaHeart>3</div>
                        <div className="item__status_msg"><FiMessageSquare ></FiMessageSquare>5</div>
                    </div>
                </div>
                <div className="person_post__item">
                    <div className="item__img">
                        
                    </div>
                    <div className="item__status">
                        <div className="item__status_heart"><FaHeart></FaHeart>3</div>
                        <div className="item__status_msg"><FiMessageSquare ></FiMessageSquare>5</div>
                    </div>
                </div>
                <div className="person_post__item">
                    <div className="item__img">
                        
                    </div>
                    <div className="item__status">
                        <div className="item__status_heart"><FaHeart></FaHeart>3</div>
                        <div className="item__status_msg"><FiMessageSquare ></FiMessageSquare>5</div>
                    </div>
                </div>
                <div className="person_post__item">
                    <div className="item__img">
                        
                    </div>
                    <div className="item__status">
                        <div className="item__status_heart"><FaHeart></FaHeart>3</div>
                        <div className="item__status_msg"><FiMessageSquare ></FiMessageSquare>5</div>
                    </div>
                </div>
            </div>
        </>


    )
}

export default PersionPage;