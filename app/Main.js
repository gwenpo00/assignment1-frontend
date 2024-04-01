import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import GlobalContext from "./pages/GlobalContext";
import Cookies from "js-cookie";
import axios from "axios";

//My Components
import Header from "./pages/Header";
import HomeGuest from "./pages/HomeGuest";
import Footer from "./pages/Footer";
import About from "./pages/About";
import Terms from "./pages/Terms";
import LoginPage from "./pages/LoginPage";
// import Home from "./components/Home";
import ProfilePageUser from "./pages/ProfilePageUser";
import UserManagementPage from "./pages/UserManagementPage";
import Home from "./pages/Home";
import ApplicationPage from "./pages/ApplicationPage";
import KanbanPage from "./pages/KanbanPage";

function Main() {
  const [loggedIn, setLoggedIn] = useState(
    false
    // Boolean(localStorage.getItem("complexappToken"))
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProjectLead, setIsProjectLead] = useState(false);

  //   const [isActive, setIsActive] = useState(false);

  const handleCookie = (token) => {
    if (token) {
      //if handleCookie is called with a value
      if (Cookies.get("token") !== token)
        Cookies.set("token", token, { expires: 7, path: "" });
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      console.log("set login to true");
      setLoggedIn(true);
    } else {
      Cookies.remove("token");
      axios.defaults.headers.common["Authorization"] = "";
      setLoggedIn(false);
    }
  };

  //useEffect
  useEffect(() => {
    //on first render, check if there are existing unexpired cookies with token in browser for auto login
    console.log("Running useEffect to read token");
    const tokenVal = Cookies.get("token");

    async function checkToken(token) {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get("http://localhost:8080/authenticate");
        if (response) {
          console.log(response);
          if (response.data.success === true) {
            handleCookie(tokenVal);
          } else {
            throw new Error("Internal Server Error");
          }
        }
      } catch (error) {
        handleCookie();
        Cookies.remove("token");
        console.log(error);
      }
    }
    if (tokenVal) {
      checkToken(tokenVal);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <GlobalContext.Provider value={{ handleCookie, setIsAdmin, isAdmin, isProjectLead, setIsProjectLead }}>
      <BrowserRouter>
        <>{loggedIn ? <Header setLoggedIn={setLoggedIn} /> : <div />}</>
        <ToastContainer />
        <Routes>
          <Route
            path="/usermanagement"
            element={loggedIn ? <UserManagementPage /> : <LoginPage />}
          />
          <Route
            path="/"
            element={
              loggedIn ? <About /> : <LoginPage setLoggedIn={setLoggedIn} />
            }
          />
          <Route
            path="/profile"
            element={loggedIn ? <ProfilePageUser /> : <LoginPage />}
          />
          <Route
            path="/app/:app_acronym"
            element={loggedIn ? <KanbanPage /> : <LoginPage 
            // component={KanbanPage}
            />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </GlobalContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
