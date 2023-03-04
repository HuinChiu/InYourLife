import { useState,useEffect,useRef } from "react";
import Drapzone from "./dropzone";
import { db,storage } from "../../firebase";
import { ref,uploadBytesResumable,getDownloadURL,listAll } from "firebase/storage";
import { addDoc,collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {FaPhotoVideo} from "react-icons/fa"
import {CgClose} from "react-icons/cg"
import {IoMdArrowRoundBack} from "react-icons/io"
import{BiChevronLeftCircle,BiChevronRightCircle} from "react-icons/bi"

function CreateNewPage({clickCreatNewHandler,memberData,personImg}){
    //確認是否下一步
    const [nextStep,setNextStep]=useState(false)
    //上傳相片
    const [imageURLs,setImageURLs]=useState([]) //將本地端url存起來
    const [storageURL, setStorageURL]=useState([]) //存取storage返回url
    const [context,setContext]=useState("")//將輸入caption存起來
    const [file, setFile] = useState("");
    //計算圖片輪播
    const [totalimgCount,setToalImgCount]=useState(0)
    const [currentImgCount,setCurrentImgCount]=useState(0)

    const navigate=useNavigate()
    const dragBox=useRef(null)
    const previewImg=useRef(null)

    const handleChange=async (e)=>{
        //上傳多張相片
        let imgList=[]
        const file =e.target.files//取得所有file
        if (!file) return;
        setFile(file)
        for (let i of file){
            console.log(i)//取得file資料
            const localImgUrl=URL.createObjectURL(i)
            imgList.push(localImgUrl)
        }
        console.log("我是ImgList",imgList)
        const imgListTotel=imgList.length
        setToalImgCount(imgListTotel)
        setImageURLs(imgList)//將本地圖片轉為blob url可顯示於螢幕上
        setNextStep(true)
    }

    //上傳照片至storage
    function uploadImg(){
        for (let i of file){
            const storageRef=ref(storage,`/post/${memberData.userId}/${i.name}`);//指定要放進去的地方
            const uploadTask=uploadBytesResumable(storageRef, i);
            uploadTask.on("state_changed",(snapshot)=>{
                const progress=Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100); //觀察目前上傳了幾％
                    console.log(progress,"%")
                },(error)=>{console.log(error.message)})}
                ()=>{//獲取上傳storage的url
                getDownloadURL(uploadTask.snapshot.ref)
                .then((url)=>{
                    console.log("我是storagrURL",url)
                    //將圖片URl放進storageurl
                    console.log("上傳完畢")
                })
                }
        

        const storageRef=ref(storage,`/post/${memberData.userId}/`);//指定要放進去的地方
        listAll(storageRef).then((resp)=>{
            console.log("listAll",resp)
            resp.items.forEach((item)=>{
                getDownloadURL(item).then((url)=>{
                    setStorageURL(pre=>[...pre,url])
                })
            })
        })

        console.log("imageList",storageURL)

        const docRef = addDoc(collection(db, "posts"),{
            timestamp:serverTimestamp(),
            username:memberData.username,
            images:storageURL,
            caption:context,
            comment:{},
            like:[],
            uid:memberData.userId
            }).then((docRef)=>{
            console.log("上傳完畢",docRef.id)
            });
        clickCreatNewHandler();
    }

    function clickNextPicture (){ //進入下一張圖片
        previewImg.current.style.backgroundImage=`url(${imageURLs[currentImgCount+1]})`
        setCurrentImgCount(pre=>pre+1)

    }
    function clickPreviousPicture (){ //返回上一張圖片
        previewImg.current.style.backgroundImage=`url(${imageURLs[currentImgCount-1]})`
        setCurrentImgCount(pre=>pre-1)
    }

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
                    {currentImgCount==0? null:<div className="newPage_rightBtn"><BiChevronLeftCircle style={{width:'30px',height:"30px"}} onClick={clickPreviousPicture}/></div>}
                    <div className="preViewImg" ref={previewImg}style={{backgroundImage:`url(${imageURLs[0]})`}}/>  {/*放置圖片處*/}
                    {currentImgCount+1==totalimgCount?null:<div className="newPage_leftBtn"><BiChevronRightCircle style={{width:'30px',height:"30px"}} onClick={clickNextPicture}/></div>}
                    <div className="perViewPost">
                        <div className="perViewPost__member">
                            <div className="perViewPost__member__img" style={{backgroundImage:`url(${personImg})`}}></div>
                            <div className="perViewPost__member__username">{memberData.username}</div>
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
            {/* <Drapzone></Drapzone> */}
            {/* ----- */}
            <div className="newPage__box">
                <div className="newPage__box_title">建立新貼文</div>
                <div className="newPage__box_putImg"
                ref={dragBox}>

                <div className="newPage__box_putImg-icon"><FaPhotoVideo style={{width:"50%",height:"50%"}}/></div>
                <div className="newPage__box_putImg-text">點選按鈕選擇圖片</div>
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