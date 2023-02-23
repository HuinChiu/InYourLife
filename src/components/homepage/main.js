import { useState,useEffect } from "react";
import { db } from "../../../firebase";
import { collection,getDocs,onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import TopBar from "./topBar";
import Container from "./container";
import { FaPooStorm } from "react-icons/fa";
function Main({memberData}){
    const [posts,setPosts]=useState([])


    useEffect(()=>{
        const q =query(collection(db, "posts"),orderBy("timestamp","desc"))
        onSnapshot(q, (querySnapshot) => { 
                const postsData = []; 
                querySnapshot.forEach((doc) => {
                    postsData.push(
                        {id:doc.id,
                        post:doc.data()
                        });
                    }); 
                setPosts(postsData); 
                console.log("我是post",posts)
            });},[])

    return(
        <div className="main">
            <TopBar></TopBar>
            {posts.map(({id,post})=>(
                    <Container 
                    key={id}
                    username={post.username} 
                    caption={post.caption} 
                    images={post.images}
                    personImg={memberData.personImg}
                    >
                    </Container>
            ))}
        </div>

    )
}

export default Main;