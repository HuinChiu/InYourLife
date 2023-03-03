import {CgClose} from "react-icons/cg"
import { db } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";


export default function DeleteAlert({handleDelete,dataId}){

    const style={width:"50px",height:"50px"}

    function deletePost(){
        deleteDoc(doc(db, "posts", dataId));
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