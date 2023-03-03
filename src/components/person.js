import { useEffect,useRef,useState } from "react";
import { useParams } from "react-router-dom"; 
import { db,auth,storage } from "../../firebase";
import { doc,setDoc,getDocs,collection, updateDoc,where,query,onSnapshot, orderBy} from "firebase/firestore";
import { ref, uploadBytesResumable,getDownloadURL  } from "firebase/storage";
import Setting from "./setting";
import ShowAllcomment from "./homepage/showTotalComment";
import {BsGrid3X3} from "react-icons/bs"
import {BiBookmark} from "react-icons/bi"
import {FaHeart} from "react-icons/fa"
import {FiMessageSquare} from "react-icons/fi"
import { AiFillSetting} from "react-icons/ai"

function PersionPage({memberData,personImg,setPersonImg,memberId,clickSetting}){
    // fullName,userName,followers,following,memberId,personImg,setPersonImg
    // const {username} =useParams();
    const [setting,setSetting]=useState(false)
    //點擊貼文true點擊收藏false
    const [selectOption,setSelectOption]=useState("post")
    const [selectData,setSelectData]=useState([])
    const [collectData,setCollectData]=useState([])
    const [fullCollect,setFullCollect]=useState([])
    //是否顯示個人頁面？
    const [clickShowAllcomment,setclickShowAllComment]=useState(false)
    
    const clickstyle ={
        borderTop: "1px solid black"
      };

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
    };

    useEffect(()=>{
         //找出自己的發文內容
         console.log("初始selectOption",selectOption)
         if (selectOption==="post"){
            const q = query(collection(db, "posts"), where("uid", "==", memberData.userId),orderBy("timestamp","desc"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                setSelectData([])
                querySnapshot.forEach((doc) => {
                    const data=(doc.data())
                    setSelectData((pre)=>[...pre,data])
                });   
                });
            }

        },[])

    useEffect(()=>{
        const findCollect=async()=>{
            const unsub = await onSnapshot(doc(db, "user", memberId), (doc) => {
                let collectList=doc.data().collect; //獲取user collect值
                console.log("funtion collectList",collectList)
                setCollectData(collectList)
    
            });
        }
        //找出收藏文章

        findCollect();

    },[])
    console.log("collectList:",collectData)

    // function getCollectData (){
    //     const collect =memberData.collect
    //     for (let i=0;i<collect.length;i++){
    //         const unsub = onSnapshot(doc(db, "posts", collect[i]), (doc) => {
    //             const data= doc.data()
    //             setCollectlPostsData((pre)=>[...pre,data])
    //         });
    //     }
    // }

    const handleSelect =async()=>{
        setSelectOption("collect")
        const result=[]
        for(let i of collectData){
            const docRef=doc(db, "posts", i)
            const docData=await onSnapshot(docRef, (doc) => {
                const data=doc.data();
                result.push(data)
                console.log("我是data",data)
            })
        }
        console.log("我是result",result)
        setTimeout(()=>{setFullCollect(result)},0)
    }
    console.log(fullCollect,"123")

    const handlePost =()=>{
        setSelectOption("post")
    }

    const showContent=()=>{
        setclickShowAllComment(true)
    }
    // async function getPostData(data){
    //     const collectData=[]
    //     for (let i=0;i<data.length;i++){
    //         console.log(data[i])                   
    //         const unsub = await onSnapshot(doc(db, "posts", data[i]), (post) => {
    //             console.log("Current data: ", post.data());
    //             collectData.push(post.data())
    //         });
    //     }
    //     console.log("我是function裡data",collectData)
    // }
        
    return(
        <>
            <div className="personDocument">
                {/* {clickShowAllcomment?<ShowAllcomment></ShowAllcomment>:null} */}
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
                    <div className="personInfomation__edit" onClick={clickSetting}>編輯個人檔案</div>
                    <div className="personInfomation__edit-icon" onClick={clickSetting}><AiFillSetting style={{width:"20px",height:"20px"}}/></div>

                    
                </div>
                <div className="personInfomation__item">
                    <div className="personInfomation__item-num"><div className="post_num">0</div>貼文</div>
                    <div className="personInfomation__followers-num"><div className="post_num">{memberData.followers.length}</div>粉絲</div>
                    <div className="personInfomation__following-num"><div className="post_num">{memberData.following.length}</div>追蹤中</div>
                </div>
                <div className="personInfomation__item introduction">
                    <div className="personInfomation__name">{memberData.fullName}</div>
                    <div className="personInfomation__introduction">{memberData.introduction}</div>
                </div>
            </div>
        </div>
        <hr className="person__hr"></hr>
        <div className="personInfomation__select">
            <div className="personInfomation__select__item" value="post" style={selectOption=="post"?clickstyle:null} 
            onClick={handlePost}>
                <div className="select_icon" id="post"  >
                <BsGrid3X3/>
                </div>
                <div className="select_title">貼文</div>
            </div>
            <div className="personInfomation__select__item" value="collect" style={selectOption=="collect"?clickstyle:null} 
            onClick={handleSelect}>
                <div className="select_icon" id="collect" ></div>
                <BiBookmark/>
                <div className="select_title">收藏</div>
            </div>
        </div>
        <div className="person_post">
            {selectOption=="post"?selectData.map((data,index)=>{
                return(
                    <div className="person_post__item" key={index}>
                        <div className="item__img"  onClick={showContent} style={{backgroundImage:`url(${data.images})`}}>
                        <div className="item__status">
                            <div className="item__status_heart"><FaHeart></FaHeart>{data.like.length}</div>
                            <div className="item__status_msg"><FiMessageSquare ></FiMessageSquare>{data.comment.length}</div>
                        </div>
                        </div>
                    </div>
                )
            }):null}
            {selectOption=="collect"?fullCollect.map((data,index)=>{
                return(
                    <div className="person_post__item" key={index}>
                        <div className="item__img"  onClick={showContent} style={{backgroundImage:`url(${data.images})`}}>
                        <div className="item__status">
                            <div className="item__status_heart"><FaHeart></FaHeart>{data.like.length}</div>
                            <div className="item__status_msg"><FiMessageSquare ></FiMessageSquare>{data.comment.length}</div>
                        </div>
                        </div>
                    </div>
                )
            }):null}

        </div>

        </>


    )
}

export default PersionPage;