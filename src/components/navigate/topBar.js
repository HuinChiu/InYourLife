import {BiCircle} from "react-icons/bi"
import{BiChevronLeftCircle} from "react-icons/bi"
import{BiChevronRightCircle} from "react-icons/bi"


function TopBar(){

    const style={width:"60px",height:"60px"}
    const style2={width:"30px",height:"30px"}
    return(
        <div className="topBarBox">
            <div className="leftBtn">
                <BiChevronLeftCircle style={style2}></BiChevronLeftCircle>
            </div>
            <div className="topBar">
                <div className="Circle">
                    <BiCircle style={style}></BiCircle>
                    <div className="Circle_userName">我是Username</div>
                </div>
                <div className="Circle">
                    <BiCircle style={style}></BiCircle>
                    <div className="Circle_userName">我是Username</div>
                </div>
                <div className="Circle">
                    <BiCircle style={style}></BiCircle>
                    <div className="Circle_userName">我是Username</div>
                </div>
                <div className="Circle">
                    <BiCircle style={style}></BiCircle>
                    <div className="Circle_userName">我是Username</div>
                </div>
                <div className="Circle">
                    <BiCircle style={style}></BiCircle>
                    <div className="Circle_userName">我是Username</div>
                </div>
                <div className="Circle">
                    <BiCircle style={style}></BiCircle>
                    <div className="Circle_userName">我是Username</div>
                </div>
                <div className="Circle">
                    <BiCircle style={style}></BiCircle>
                    <div className="Circle_userName">我是Username</div>
                </div>
                <div className="Circle">
                    <BiCircle style={style}></BiCircle>
                    <div className="Circle_userName">我是Username</div>
                </div>
                <div className="Circle">
                    <BiCircle style={style}></BiCircle>
                    <div className="Circle_userName">我是Username</div>
                </div>
                <div className="Circle">
                    <BiCircle style={style}></BiCircle>
                    <div className="Circle_userName">我是Username</div>
                </div>
                <div className="Circle">
                    <BiCircle style={style}></BiCircle>
                    <div className="Circle_userName">我是Username</div>
                </div>
            </div> 
            <div className="rightBtn">
                <BiChevronRightCircle style={style2}/>
            </div>
        </div>

    )
}

export default TopBar;