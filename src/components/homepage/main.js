import { useState,useEffect } from "react";
import { db } from "../../../firebase";
import { doc,collection,getDocs,onSnapshot, orderBy, query, Timestamp,limit } from "firebase/firestore";
import TopBar from "./topBar";
import Container from "./container";
import { FaPooStorm } from "react-icons/fa";

function Main({memberData,memberId}){
    const [posts,setPosts]=useState([])


    // useEffect(()=>{
        const getPostData=async ()=>{
            const q =query(collection(db, "posts"),orderBy("timestamp","desc"))
            onSnapshot(q,(querySnapshot) => { 
                const postsData = []; 
                querySnapshot.forEach((doc) => {
                    postsData.push(
                        {id:doc.id,
                        post:doc.data()
                        });
                    });
                setPosts(postsData); 
                })
        }
        getPostData();

            // const snapshot=()=>{
            //     const unsubscribe = onSnapshot(collection(db, 'user'), (querySnapshot) => {
            //         querySnapshot.forEach((doc) => {
            //         console.log("querySnapshot",doc.data())
            //         });
            //     });
            // }
            // snapshot();
    // ;},[])


    return(
        <div className="main">
            {/* <TopBar></TopBar> */}
            {posts.map(({id,post})=>(
                    <Container 
                    key={id}
                    personImg={memberData.personImg}
                    dataId={id}
                    memberData={memberData}
                    memberId={memberId}
                    post={post}
                    >
                    </Container>
            ))}
        </div>

    )
}

export default Main;