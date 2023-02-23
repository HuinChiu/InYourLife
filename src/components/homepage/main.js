import { useState,useEffect } from "react";
import { db } from "../../../firebase";
import { collection,getDocs,onSnapshot } from "firebase/firestore";
import TopBar from "./topBar";
import Container from "./container";
import { FaPooStorm } from "react-icons/fa";
function Main(){
    const [posts,setPosts]=useState([])


    useEffect(()=>{
        onSnapshot(
            collection(db, "posts"), 
            (querySnapshot) => { 
                const postsData = []; 
                querySnapshot.forEach((doc) => {
                    postsData.push(
                        {id:doc.id,
                        post:doc.data()
                        });
                    }); 
                setPosts(postsData); 
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
                    >
                    </Container>
            ))}
        </div>

    )
}

export default Main;