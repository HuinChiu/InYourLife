import React from "react";
import { useEffect,useState } from "react";
import { db,auth,storage } from "../../firebase";
import { doc,setDoc,getDocs,collection, updateDoc} from "firebase/firestore";
import { ref, uploadBytesResumable,getDownloadURL  } from "firebase/storage";
import {BsGrid3X3} from "react-icons/bs"
import {BiBookmark} from "react-icons/bi"
import {FaHeart} from "react-icons/fa"
import {FiMessageSquare} from "react-icons/fi"
function PersionPage({memberData,personImg,setPersonImg,memberId}){
    // fullName,userName,followers,following,memberId,personImg,setPersonImg
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
                //更新firestroe會員個人頭像url
                await updateDoc(washingtonRef,{
                    personImg:url
                }).then(()=>{
                    console.log("update!")
                })
                .catch((error)=>console.log(error)) 
            })
        })
    }




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
                        <div className="personInfomation__id-name">{memberData.username}</div>
                        <div className="personInfomation__edit">編輯個人檔案</div>
                    </div>
                    <div className="personInfomation__item">
                        <div className="personInfomation__item-num"><div className="post_num">0</div>貼文</div>
                        <div className="personInfomation__followers-num"><div className="post_num">{memberData.followers.length}</div>粉絲</div>
                        <div className="personInfomation__following-num"><div className="post_num">{memberData.following.length}</div>追蹤中</div>
                    </div>
                    <div className="personInfomation__item">
                        <div className="personInfomation__name">{memberData.fullName}</div>
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