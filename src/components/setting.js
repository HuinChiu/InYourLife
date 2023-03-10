import React from "react";
import { useState,useEffect } from "react";
import { db } from "../../firebase";
import { updateDoc,doc,collection, query, where,getDocs,arrayUnion} from "firebase/firestore";
import { CgClose } from "react-icons/cg";
function Setting({memberData,clickSetting,memberId}){

    const [username,setUsername]=useState("")
    const [fullname,setFullname]=useState("")
    const [introduction,setIntroduction]=useState("")

    const [likeData,setLikeData]=useState([])

    //更新會員資料上傳至storage
    async function updateUserData(){
        //更新會員資料庫的資料
        const washingtonRef=doc(db,"user",memberId);
        await updateDoc(washingtonRef,{
            username:username,
            fullName:fullname,
            introduction:introduction
        }
        ).catch((error)=>{
            console.log(error)
        });

        //獲取資料庫含有會員貼文的資料
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("uid", "==", memberData.userId));
        const querySnapshot = await getDocs(q);
                querySnapshot.forEach((document) => {
                // 更新貼文資料庫的會員姓名資料
                const washingPostRef=doc(db,"posts",document.id)
                updateDoc(washingPostRef,{
                    username:username,
                })

                // //更新post username
                // const queryAllposts=getDocs(collection(db,"posts")).then((data)=>{
                //     let documentComment =[]
                //     let documentID=[]
                //     //找到貼文裡留言者
                //     data.forEach((doc)=>{
                //         documentComment.push(doc.data().comment)//抓取留言內容
                //         documentID.push(doc.id)//抓取留言者uid
                //     })
                //     console.log("documentComment",documentComment)
                //     console.log("documentID",documentID)
                //     for(let i=0;i<documentComment.length;i++){
                //         let allComment=documentComment[i]
                //         for (let doc of allComment){
                //             console.log("allcomment",doc)
                //             if (doc.uid===memberData.userId){
                //                 doc.username=username
                //             }
                            
                //         }
                //     }

                //     for (let i=0;i<documentID.length;i++){
                //         console.log("document id",documentID[i])
                //         const washingPostRef=doc(db,"posts",documentID[i])
                //         updateDoc(washingPostRef,{
                //             comment:documentComment[i]
                //                 })
                //     }
                // })



                clickSetting();
                });

                

    };


    return(
        <>
            <div className="setting__background">
                <div className="setting__closebtn" onClick={clickSetting}>
                    <CgClose style={{width:"50px",height:"50px"}}></CgClose>
                </div>
                <div className="settingBox">
                    <div className="settingBox__title">編輯個人檔案</div>
                    <label htmlFor="setting__username">
                        <div>使用者名稱</div>
                        <span>
                            <input type="text" name="useame" id="setting__username"
                            defaultValue={memberData.username}
                            onChange={(e)=>{setUsername(e.target.value)}}
                            ></input>
                        </span>
                    </label>
                    <label htmlFor="setting__fullname">
                        <div>姓名</div>
                        <span>
                        <input type="text" name="fullname"id="setting__fullname"
                        defaultValue={memberData.fullName}
                        onChange={(e)=>{setFullname(e.target.value)}}
                        ></input>
                        </span>
                    </label>
                    <label htmlFor="setting__introduction">
                        <div>個人簡介</div>
                        <span>
                        <textarea type="text" name="introduction"id="setting__introduction"
                        defaultValue={memberData.introduction}
                        onChange={(e)=>{setIntroduction(e.target.value)}}
                        ></textarea>
                        </span>

                    </label>
                    <div className="setting__btn" onClick={updateUserData}>提交</div>
                </div>
            </div>

        </>
    )

}

export default Setting;