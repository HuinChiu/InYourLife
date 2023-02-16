import React from "react";
import { Route ,Routes} from "react-router-dom";
import SignIn from "./components/Signin";
import HomePage from "./components/Homepage";
import SignUp from "./components/Singup";

function App() {

    return (
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="/signin" element={<SignIn></SignIn>}></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
      </Routes>
    );
  
  }

export default App;