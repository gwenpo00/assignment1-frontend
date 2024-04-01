import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import GlobalContext from "./GlobalContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Header() {
  const { handleCookie, isAdmin, setIsAdmin } = useContext(GlobalContext);
  const location = useLocation();
  // const loggedIn = Boolean(localStorage.getItem("complexappToken"));
  const navigate = useNavigate();



  useEffect(() => {
    console.log("Running useEffect to check if user is admin");
    async function checkGroup(groupname) {
      try {
        const response = await axios
          .post("http://localhost:8080/authorize", {
            groupname,
          })
          .catch((error) => {
            console.log(error);
            throw new Error(error.message);
          });
        console.log(response);
        setIsAdmin(response.data.success);
      } catch (error) {
        console.log(error);
        // handleAlerts(error.message, false);
        console.log("cannot check");
      }
    }
    checkGroup("Admin");
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    handleCookie();
    navigate("/");
  };

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            TMS
          </Link>
        </h4>

        <div className="flex-row my-3 my-md-0">
          {isAdmin ? (
            <a className="btn btn-sm btn-success mr-2" href="/userManagement">
              User Management
            </a>
          ) : null}
          <a className="btn btn-sm btn-success mr-2" href="/profile">
            My Profile
          </a>
          <button onClick={handleLogout} className="btn btn-sm btn-secondary">
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
