import Skeleton from "react-loading-skeleton"

const CardSkeleton=()=>{
    return(
        <div className="card-skeleton">
            <div className="top-row">
                <Skeleton style={{width:"50%"}}/>
            </div>
            <div className="image-row">
                <Skeleton/>
            </div>
        </div>
    )
}