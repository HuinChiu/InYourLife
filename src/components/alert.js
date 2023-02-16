import React from "react";
const Alert=()=>{
    
    return(
        <>
        <div className="alert">
            <div className="alertBox">
                {/* <div className="alert__closeBtn"></div> */}
                <div className="alert__title">警告</div>
                <div className="alert__msg">帳號登入錯誤，請重新輸入！</div>
            </div>

        </div>
    </>
    )

}

export default Alert;