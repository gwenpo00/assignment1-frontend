import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import GlobalContext from "./GlobalContext";
import Page from "./Page";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage(props) {
  const [loggedIn, setLoggedIn] = useState();
  // const { handleCookie } =
  const navigate = useNavigate();
  const { handleCookie, handleAlerts } = useContext(GlobalContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:8080/login", {
        username,
        password,
      });
      console.log(response);
      if (response.data) {
        // Cookies.set("authToken", response.data.token, { expires: 1 });
        console.log(response.data);
        handleCookie(response.data.token);
        toast.success("Logged in successfully!", {
          autoClose: 700, 
        });
        setUsername("");
        setPassword("");
        navigate("/");
        console.log(response.data.message);
        // handleAlerts("Login successful", true);
      } else {
        console.log("Incorrect username / password.");
        console.log(response.data.message);
        // toast.success("Helooo");
      }
    } catch (error) {
      // console.log(response.data.message);
      console.log(error.response.data.message);
      if (error.response.data.message.includes("inactive")) {
        toast.error("User is inactive!", {
          autoClose: 700, 
        });
      } else {
        toast.error("Incorrect username / password!", {
          autoClose: 700, 
        });
      }
    }
  }
  return (
    <Page title="Welcome!" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5 mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Enter username"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Enter password"
              />
            </div>
            <button className="py-3 mt-4 btn btn-success btn-block">
              Login
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default HomePage;
