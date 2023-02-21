import { Route ,Routes} from "react-router-dom";
import SignIn from "./components/Signin";
import HomePage from "./components/Homepage";
import SignUp from "./components/Singup";
// import PersionPage from "./components/person";
function App() {

    return (
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="/signin" element={<SignIn></SignIn>}></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        {/* <Route path="/person" element={<PersionPage></PersionPage>}></Route> */}
      </Routes>
    );
  
  }

export default App;