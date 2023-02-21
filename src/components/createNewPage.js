import { useState } from "react";
import {FaPhotoVideo} from "react-icons/fa"
import {CgClose} from "react-icons/cg"

function CreateNewPage({clickCreatNewHandler={clickCreatNewHandler}}){



    return(
        <>
            <div className="newPage__container">
                <div className="newPage__container_close-btn" onClick={clickCreatNewHandler}>
                    <CgClose style={{width:"50px",height:"50px"}}></CgClose>
                </div>
                <div className="newPage__box">
                    <div className="newPage__box_title">建立新貼文</div>
                    <div className="newPage__box_putImg">
                        <div className="newPage__box_putImg-icon"><FaPhotoVideo style={{width:"50%",height:"50%"}}/></div>
                        <div className="newPage__box_putImg-text">將相片和影片拖曳到這裡</div>
                        <div className="newPage__box_putImg-btn">從電腦裡選擇</div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CreateNewPage;