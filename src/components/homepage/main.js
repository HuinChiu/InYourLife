import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  doc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  Timestamp,
  limit,
  startAfter,
} from "firebase/firestore";
import TopBar from "../navigate/topBar";
import Container from "./container";
import { FaPooStorm } from "react-icons/fa";

function Main({ memberData, memberId }) {
  const initState = {
    post: posts,
  };

  const [posts, setPosts] = useState([]);
  const [limitNum, setLimitNum] = useState(3);

  const getPostData = () => {
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(limitNum)
    );
    onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, post: doc.data() });
      });
      setPosts(postsData);
      setLimitNum((pre) => pre + 3);
    });
  };
  useEffect(() => {
    getPostData();
  }, []);

  const handleScroll = (e) => {
    if (
      window.innerHeight + e.target.documentElement.scrollTop + 1 >=
      e.target.documentElement.scrollHeight
    ) {
      getPostData();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [limitNum]);

  return (
    <div className="main">
      {/* <TopBar></TopBar> */}
      {posts.map(({ id, post }, index) => (
        <Container
          key={index}
          personImg={memberData.personImg}
          dataId={id}
          memberData={memberData}
          memberId={memberId}
          post={post}
        ></Container>
      ))}
    </div>
  );
}

export default Main;
