import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
import App from "./app";
import "./css/index.css";
import "./css/sign.css";
import "./css/homepage.css";
import "./css/sideBar.css";
import "./css/topBar.css";
import "./css/container.css";
import "./css/person.css";
import "./css/createNewPage.css";
import "./css/setting.css";
import "./css/showAllcomment.css";
import "./css/deleteAlert.css";
import "./css/sendMsg.css";
import "./css/chatroom.css";
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
