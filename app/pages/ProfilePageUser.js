import React, { useEffect, useContext, useState } from "react";
import GlobalContext from "./GlobalContext";
import axios from "axios";
import Page from "./Page";
import { toast } from "react-toastify";


function ProfilePageUser() {
  const { handleAlerts } = useContext(GlobalContext);
  // const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [editReq, setEditReq] = useState(0);

  useEffect(() => {
    console.log("Running useEffect to get profile");
    async function getProfile() {
      try {
        const response = await axios.get("http://localhost:8080/profile");
        console.log(response.data);
        if (response.data && response.data.success === true) {
          setUsername(response.data.results.username);
          setEmail(response.data.results.email);
          console.log("ok");
          // setEmail(response.data.email ? response.data.email : "");
        } else {
          console.log("canot");
          throw new Error("Internal Server Error");
        }
      } catch (error) {
        
        console.log(error);
        console.log("cannot");
      }
    }

    getProfile();
  }, );

  function ViewProfile({setIsEditing}) {
    return (
      <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5 mx-auto">
        <div>
          <form>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Your Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                autoComplete="off"
                Value={email}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Your Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Password"
                Value="********"
                readOnly
              />
              {/* <div>
                  <button type="button" className="btn btn-sm btn-secondary">
                    Edit
                  </button>
                </div> */}
            </div>
            {/* <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                Sign up for ComplexApp
              </button> */}
            <button
              className="py-3 mt-4 btn btn-success btn-block"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          </form>
        </div>
      </div>
    );
  }

  function EditProfile({setIsEditing, setEditReq}) {
    const [newEmail, setNewEmail] = useState(email);
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:8080/profile/update", {
          email : newEmail,
          password : newPassword,
          // username,
        });
        console.log("ok can", newEmail);
        console.log(response);
        if (response.data.success) {
          toast.success("Profile updated successfully!", {
            autoClose: 700, 
          });
          console.log(response.data);
        } else {
          toast.error("Profile update failed!", {
            autoClose: 700, 
          });
          console.log("Update failed");
          console.log(response.data.message);
        }
      } catch (e) {
        console.log(e);
        console.log("There was a problem.");
      }
    };

    return (
      <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5 mx-auto">

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email-register" className="text-muted mb-1">
                  <small>Your Email</small>
                </label>
                <input
                  id="email-register"
                  name="email"
                  className="form-control"
                  type="text"
                  autoComplete="off"
                  Value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password-register" className="text-muted mb-1">
                  <small>Your Password</small>
                </label>
                <input
                  id="password-register"
                  name="password"
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  Value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
              <button className="py-3 mt-4 btn btn-success btn-block" type="submit">
                Save
              </button>
              <button onClick={() => setEditing(false)} className="py-3 mt-4 btn btn-success btn-block">
                Cancel
              </button>
              </div>
            </form>
            </div>
    )
  }

  return (
    <Page title="Your Profile">
      <h3>
        <strong>{username}</strong> Details
      </h3>
      { editing ? <EditProfile /> : <ViewProfile />}
      {/* {<TestingProfile />} */}
    </Page>
  );
}

export default ProfilePageUser;
