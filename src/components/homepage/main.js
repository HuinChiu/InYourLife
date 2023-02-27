import { useState,useEffect } from "react";
import { db } from "../../../firebase";
import { collection,getDocs,onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import TopBar from "./topBar";
import Container from "./container";
import { FaPooStorm } from "react-icons/fa";
function Main({memberData,memberId}){
    console.log("我是main ,memnerdata",memberData)
    const [posts,setPosts]=useState([])

    useEffect(()=>{
        const getPostData=async ()=>{
            const q =query(collection(db, "posts"),orderBy("timestamp","desc"))
            await onSnapshot(q, (querySnapshot) => { 
                    const postsData = []; 
                    querySnapshot.forEach((doc) => {
                        // console.log("我是doc",doc.data().comment)
                        postsData.push(
                            {id:doc.id,
                            post:doc.data()
                            });
                        });
                    // console.log(postsData)
                    setPosts(postsData); 
                })
            console.log("我是post",posts)
        }
        getPostData();
;},[])

    return(
        <div className="main">
            {/* <TopBar></TopBar> */}
            {posts.map(({id,post})=>(
                    <Container 
                    key={id}
                    username={post.username} 
                    caption={post.caption} 
                    images={post.images}
                    personImg={memberData.personImg}
                    comment={post.comment}
                    dataId={id}
                    memberData={memberData}
                    memberId={memberId}
                    >
                    </Container>
            ))}
        </div>

    )
}

export default Main;