import { useState,useEffect,useRef } from "react";
import { db,storage } from "../../firebase";
import {FaPhotoVideo} from "react-icons/fa"
import {CgClose} from "react-icons/cg"
import {IoMdArrowRoundBack} from "react-icons/io"

function CreateNewPage({clickCreatNewHandler,userName,personImg}){
    //確認是否下一步
    const [nextStep,setNextStep]=useState(false)
    //上傳相片
    const [images,setImages]=useState("")
    const [imageURLs,setImageURLs]=useState([])
    const [storageURL, setStorageURL]=useState("")
    const [context,setContext]=useState("")


    const handleChange=(e)=>{
        setNextStep(true)
        const files =e.target.files
        const imagesList=[]
        for (let i=0;i<files.length;i++){
            imagesList.push(URL.createObjectURL(e.target.files[i]))
        }
        setImageURLs(imagesList)
        //預覽圖片
    }

    function updatePost(){
        //上傳照片至storage
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
                const data={
                    dataCreates:serverTimestamp(),
                    caption:context,
                    followers:[],
                    images:[url],
                    likes:[],
                    message:[],
                    username:userName
                }

            })
        })


        // console.log(data)
        // addDoc(collection(db, "pots"), data).then((data)=>{
        //     console.log(data); 
        // });
    }

    return(
        <>
        {nextStep?
        <div className="newPage__container">
            <div className="newPage__container_close-btn" onClick={clickCreatNewHandler}>
                <CgClose style={{width:"50px",height:"50px"}}></CgClose>
            </div>
            <div className="newPage__box">
                <div className="newPage__box_title-group">
                    <div className="back" onClick={()=>{setNextStep(false)}}><IoMdArrowRoundBack style={{width:"30px",height:"30px"}}/></div>
                    <div >建立新貼文</div>
                    <div className="next">分享</div>
                </div>

                <div className="newPage__newPost">
                    <div className="preViewImg" style={{backgroundImage:`url(${imageURLs[0]})`}}>
                        {/* {imageURLs.map((img,index)=>{ 
                            return <img className="perviewImg__item" key={index} src={img}></img>
                            })} */}
                    </div>
                    <div className="perViewPost">
                        <div className="perViewPost__member">
                            <div className="perViewPost__member__img" style={{backgroundImage:`url(${personImg})`}}></div>
                            <div className="perViewPost__member__username">{userName}</div>
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