import React from "react";
import { useState } from "react";
import { db } from "../../firebase";
import { updateDoc,doc} from "firebase/firestore";
import { CgClose } from "react-icons/cg";
function Setting({memberData,clickSetting,memberId}){
    console.log(memberData)
    console.log(memberId)

    const [username,setUsername]=useState("")
    const [fullname,setFullname]=useState("")
    const [introduction,setIntroduction]=useState("")
    //更新會員資料上傳至storage
    async function updateUserData(){
        console.log("click setting!!")
        const washingtonRef=doc(db,"user",memberId);
        await updateDoc(washingtonRef,{
            username:username,
            fullName:fullname,
            introduction:introduction
        }).then(()=>{
            console.log("會員資料更新成功")
        }).catch((error)=>{
            console.log(error)
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