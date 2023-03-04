import {CgClose} from "react-icons/cg"
import { db } from "../../firebase";
import { doc, deleteDoc,updateDoc,where,arrayUnion, getDocs,arrayRemove,collection,query } from "firebase/firestore";


export default function DeleteAlert({handleDelete,dataId,memberId}){

    const style={width:"50px",height:"50px"}

    async function deletePost(){
        //刪除所有會員內有此收藏此貼文
        const q = query(collection(db, "user"), where("collect", "array-contains", dataId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((data) => {
          // doc.data() is never undefined for query doc snapshots
            console.log("我是會員id",data.id, " => ", "我是會員資料",data.data());
            const washingtonRef = doc(db, "user", data.id);
            // Atomically remove a region from the "regions" array field.
            updateDoc(washingtonRef, {
                collect: arrayRemove(dataId)
            });
            console.log("刪除會員collect成功")
        });

        //刪除資料庫貼文資料
        await deleteDoc(doc(db, "posts", dataId));
        console.log("刪除貼文資料")
    }

    return(
        <>
        <div className="delete__box">
            <div className="delete__container">
                <div className="delete__title">
                    <div>是否刪除貼文？</div>
                </div>
                <div className="delete__select">
                    <div className="delete__selec__delete" onClick={deletePost}>
                        <div>刪除</div>
                    </div>
                    <div className="delete__selec__cancel" onClick={handleDelete}>
                        <div>取消</div>
                    </div>
                </div>
            </div>

        </div>
        </>
    )
};