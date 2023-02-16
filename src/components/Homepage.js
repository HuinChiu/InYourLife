import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged,signOut } from "firebase/auth";
import NavBar from "./homepage/sidebar";
import Main from "./homepage/main";

function HomePage(){
    const navigate=useNavigate();

    function checkSinIN(){
        onAuthStateChanged(auth,(user)=>{
            if(user){
                const uid=user.uid;
                console.log(uid)
            }
            else{
                console.log("not login")
                navigate("/sign")

            }
        })
    };
    checkSinIN();


    function signOUT(){
      console.log("signout");
      signOut(auth)
      .then(()=>{
        console.log("signout successful")
      })
      .catch((error)=>{
        console.log(error.code)
      })  
    }


    return(
        <>
        <div className="homeBox">

            <NavBar></NavBar>
            <div className="homeMain">
                <Main></Main>
            </div>

        </div>
        </>
    )
}

export default HomePage;