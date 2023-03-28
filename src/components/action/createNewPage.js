import { useState, useEffect, useRef } from "react";
// import Drapzone from "../../dropzone";
import { db, storage } from "../../../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp,doc,updateDoc,arrayUnion } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaPhotoVideo } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BiChevronLeftCircle, BiChevronRightCircle } from "react-icons/bi";

function CreateNewPage({ clickCreatNewHandler, memberData, personImg }) {
  //確認是否下一步
  const [nextStep, setNextStep] = useState(false);
  //上傳相片
  const [imageURLs, setImageURLs] = useState([]); //將本地端url存起來
  const [storageURL, setStorageURL] = useState([]); //存取storage返回url
  const [context, setContext] = useState(""); //將輸入caption存起來
  const [file, setFile] = useState([]);
//   const [docId,setDocId]=useState("")
  //計算圖片輪播
  const [totalimgCount, setToalImgCount] = useState(0);
  const [currentImgCount, setCurrentImgCount] = useState(0);

  const navigate = useNavigate();
  const dragBox = useRef(null);
  const previewImg = useRef(null)

  //loading
  const[loading,setLoading]=useState(false)

  useEffect(()=>{
    document.title="InYourLife-建立貼文"
})
  const handleChange = async (e) => {
    //上傳多張相片
    let imgList = [];
    let fileList=[]
    const file = e.target.files; //取得所有file
    console.log("我是file", file);
    if (!file) return;
    setFile(file);
    for (let i of file) {
      fileList.push(i)
      console.log(i); //取得file資料
      const localImgUrl = URL.createObjectURL(i);
      imgList.push(localImgUrl);
    }
    console.log("我是ImgList", imgList);
    const imgListTotel = imgList.length;
    setToalImgCount(imgListTotel);
    setImageURLs(imgList); //將本地圖片轉為blob url可顯示於螢幕上
    setNextStep(true);
    setFile(fileList)
  };

  //上傳照片至storage
  function uploadImg() {
        setLoading(true)
        const docRef = addDoc(collection(db, "posts"), {
        timestamp: serverTimestamp(),
        username: memberData.username,
        images: [],
        caption: context,
        commentCount:0,
        like: [],
        uid: memberData.userId,
        }).then((docRef) => {
        console.log("建立好firestore文件", docRef.id);
        file.forEach(async(data)=>{
            const storageRef = ref(storage, `/post/${data.name}`);
            const uploadTask = uploadBytesResumable(storageRef, data)
            uploadTask.on("state_changed",(snapshot)=>{
                console.log('Uploaded a blob or file!')
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },(error)=>{
                console.log(error)
            },()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    const washingtonRef = doc(db, "posts", docRef.id);
                    updateDoc(washingtonRef, {
                        images: arrayUnion(downloadURL)})
                        });
                clickCreatNewHandler()
                setLoading(false)
            });
        })

        })


  }


  function clickNextPicture() {
    //進入下一張圖片
    previewImg.current.style.backgroundImage = `url(${
      imageURLs[currentImgCount + 1]
    })`;
    setCurrentImgCount((pre) => pre + 1);
  }
  function clickPreviousPicture() {
    //返回上一張圖片
    previewImg.current.style.backgroundImage = `url(${
      imageURLs[currentImgCount - 1]
    })`;
    setCurrentImgCount((pre) => pre - 1);
  }

  return (
    <>
      {nextStep ? (
        // 建立新貼文輸入框
        <div className="newPage__container">
           {loading?
            <div className="newPage__container__loading">
                <div className="loadingio-spinner-spin-sub1ib266w"><div className="ldio-x2f8f9g0nn">
                <div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div>
                </div></div>
            </div>:
            null
            }
          <div
            className="newPage__container_close-btn"
            onClick={clickCreatNewHandler}
          >
            <CgClose style={{ width: "50px", height: "50px" }}></CgClose>
          </div>
          <div className="newPage__box">
            <div className="newPage__box_title-group">
              <div
                className="back"
                onClick={() => {
                  setNextStep(false);
                }}
              >
                <IoMdArrowRoundBack style={{ width: "30px", height: "30px" }} />
              </div>
              <div>建立新貼文</div>
              <div className="next" onClick={uploadImg}>
                分享
              </div>
            </div>
            <div className="newPage__newPost">
              {currentImgCount == 0 ? null : (
                <div className="newPage_rightBtn">
                  <BiChevronLeftCircle
                    style={{ width: "30px", height: "30px" }}
                    onClick={clickPreviousPicture}
                  />
                </div>
              )}
              <div
                className="preViewImg"
                ref={previewImg}
                style={{ backgroundImage: `url(${imageURLs[0]})` }}
              />{" "}
              {/*放置圖片處*/}
              {currentImgCount + 1 == totalimgCount ? null : (
                <div className="newPage_leftBtn">
                  <BiChevronRightCircle
                    style={{ width: "30px", height: "30px" }}
                    onClick={clickNextPicture}
                  />
                </div>
              )}
              <div className="perViewPost">
                <div className="perViewPost__member">
                  <div
                    className="perViewPost__member__img"
                    style={{ backgroundImage: `url(${personImg})` }}
                  ></div>
                  <div className="perViewPost__member__username">
                    {memberData.username}
                  </div>
                </div>
                <textarea
                  className="perViewPost__input"
                  type="text"
                  placeholder="撰寫說明文字"
                  onChange={(e) => {
                    setContext(e.target.value);
                  }}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      ) : (
        //建立新貼文框
        <div className="newPage__container">
          <div
            className="newPage__container_close-btn"
            onClick={clickCreatNewHandler}
          >
            <CgClose style={{ width: "50px", height: "50px" }}></CgClose>
          </div>
          {/* <Drapzone></Drapzone> */}
          {/* ----- */}
          <div className="newPage__box">
            <div className="newPage__box_title">建立新貼文</div>
            <div className="newPage__box_putImg" ref={dragBox}>
              <div className="newPage__box_putImg-icon">
                <FaPhotoVideo style={{ width: "50%", height: "50%" }} />
              </div>
              <div className="newPage__box_putImg-text">點選按鈕選擇圖片</div>
              <label htmlFor="uploadPostImg">
                <input
                  id="uploadPostImg"
                  type="file"
                  accept="image/*"
                  multiple="multiple"
                  onChange={handleChange}
                />

                <div className="newPage__box_putImg-btn">從電腦裡選擇</div>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateNewPage;
