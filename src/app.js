import { Route, Routes } from "react-router-dom";
import SignIn from "./components/action/Signin";
import { HomePage } from "./components/Homepage";
import SignUp from "./components/action/Singup";
import { SkeletonTheme } from "react-loading-skeleton";
import ChatRoom from "./components/chatroom/chatRoom";
function App() {
  return (
    <SkeletonTheme baseColor="#d3d3d3" heightlightColor="#525252">
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="/signin" element={<SignIn></SignIn>}></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        <Route path="/setting" element={<SignUp></SignUp>}></Route>
        <Route path="/chatRoom" element={<ChatRoom></ChatRoom>}></Route>
        {/* <Route path="/:username/" element={<PersionPage></PersionPage>}></Route> */}
      </Routes>
    </SkeletonTheme>
  );
}

export default App;
