import { useState,useEffect,useRef } from "react";
import { db,storage } from "../../firebase";
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { addDoc,collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {FaPhotoVideo} from "react-icons/fa"
import {CgClose} from "react-icons/cg"
import {IoMdArrowRoundBack} from "react-icons/io"

function CreateNewPage({clickCreatNewHandler,memberData,personImg}){
    //確認是否下一步
    const [nextStep,setNextStep]=useState(false)
    //上傳相片
    const [imageURLs,setImageURLs]=useState([]) //將本地端url存起來
    const [storageURL, setStorageURL]=useState("")
    const [context,setContext]=useState("")//將輸入caption存起來
    const [file, setFile] = useState("");

    const navigate=useNavigate()


    const handleChange=async (e)=>{
        setNextStep(true)
        const file =e.target.files[0]
        setFile(e.target.files[0])
        if (!file) return;
        //預覽圖片，獲取本地端imageURL
        const localImgUrl=URL.createObjectURL(e.target.files[0])
        //將預覽圖片放進imageURL顯示在img上
        setImageURLs(localImgUrl)
        console.log("我是Images",localImgUrl)
    }
    console.log("我是外面的file",file)
    //上傳照片至storage
    function uploadImg(){
        console.log(context)
        console.log(file)
        const storageRef=ref(storage,`/post/${file.name}`);
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
                console.log("我是storagrURL",url)
                //將貼文新增至firestroe posts
                const docRef = addDoc(collection(db, "posts"),{
                    timestamp:serverTimestamp(),
                    username:memberData.username,
                    images:url,
                    caption:context,
                }).then((docRef)=>{
                    console.log("上傳完畢",docRef.id)
                });
            })
        clickCreatNewHandler();
        })
    }

    console.log(personImg)

    return(
        <>
        {nextStep?
        // 建立新貼文輸入框
        <div className="newPage__container">
            <div className="newPage__container_close-btn" onClick={clickCreatNewHandler}>
                <CgClose style={{width:"50px",height:"50px"}}></CgClose>
            </div>
            <div className="newPage__box">
                <div className="newPage__box_title-group">
                    <div className="back" onClick={()=>{setNextStep(false)}}><IoMdArrowRoundBack style={{width:"30px",height:"30px"}}/></div>
                    <div >建立新貼文</div>
                    <div className="next" onClick={uploadImg}>分享</div>
                </div>
                <div className="newPage__newPost">
                    <div className="preViewImg" style={{backgroundImage:`url(${imageURLs})`}}>
                    </div>
                    <div className="perViewPost">
                        <div className="perViewPost__member">
                            <div className="perViewPost__member__img" style={{backgroundImage:`url(${personImg})`}}></div>
                            <div className="perViewPost__member__username">{memberData.userName}</div>
                        </div>
                        <textarea className="perViewPost__input"type="text"
                        placeholder="撰寫說明文字"
                        onChange={(e)=>{setContext(e.target.value)}}
                        ></textarea>
                    </div>
                </div>

                
            </div>
        </div>
        :
        //建立新貼文框
        <div className="newPage__container">
        <div className="newPage__container_close-btn" onClick={clickCreatNewHandler}>
            <CgClose style={{width:"50px",height:"50px"}}></CgClose>
        </div>
        <div className="newPage__box">
            <div className="newPage__box_title">建立新貼文</div>
            <div className="newPage__box_putImg">
                <div className="newPage__box_putImg-icon"><FaPhotoVideo style={{width:"50%",height:"50%"}}/></div>
                <div className="newPage__box_putImg-text">將相片和影片拖曳到這裡</div>
                <label htmlFor ="uploadPostImg">
                <input id="uploadPostImg" type="file" accept="image/*" multiple="multiple" 
                 onChange={handleChange}/>

                <div className="newPage__box_putImg-btn">從電腦裡選擇</div>
                </label>

            </div>
        </div>
    </div>
        }


        </>
    )
}

export default CreateNewPage;