import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import SideBar from "./homepage/sidebar";
import Main from "./homepage/main";
import PersionPage from "./person";
import CreateNewPage from "./createNewPage";

function HomePage(){
    const navigate=useNavigate();

    const[clickPerson,setCLickPerson]=useState(false)
    const [clickCreateNewPage,setCreateNewPage]=useState(false)

    function checkSinIN(){
        onAuthStateChanged(auth,(user)=>{
            if(user){
                const uid=user.uid;
                console.log(uid)
            }
            else{
                console.log("not login")
                navigate("/signin")

            }
        })
    };
    checkSinIN();

    function clickPersonHandler(){
        !clickPerson?setCLickPerson(true):null
    }
    function clickCreatNewHandler(){
        !clickCreateNewPage?setCreateNewPage(true):setCreateNewPage(false)
    }

    function clickBackHomePage(){
        clickPerson?setCLickPerson(false):null
        navigate("/")
    }





    return(
        <>
        <div className="homeBox">

            <SideBar clickPersonHandler={clickPersonHandler}
                    clickCreatNewHandler={clickCreatNewHandler}
                    clickBackHomePage={clickBackHomePage}

            ></SideBar>
            <div className="homeMain">
                {clickPerson?<PersionPage/>:<Main/>}
            </div>
            {clickCreateNewPage?<CreateNewPage clickCreatNewHandler={clickCreatNewHandler}/>:null}

        </div>
        </>
    )
}

export default HomePage;